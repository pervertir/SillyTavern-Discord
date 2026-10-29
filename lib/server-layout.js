// The server rail's order and folders, as Discord keeps them. A layout is a list of entries:
// a server (its group id, as a string) or a folder { folder, name, color, open, ids }.
// Every function returns a new layout and leaves the one given alone. No DOM, no SillyTavern.

/** @typedef {{ folder: string, name: string, color: string, open: boolean, ids: string[] }} Folder */
/** @typedef {string | Folder} Entry */

const isFolder = entry => typeof entry === 'object' && entry !== null && Array.isArray(entry.ids);

function copy(layout) {
    return layout.map(entry => (isFolder(entry) ? { ...entry, ids: [...entry.ids] } : entry));
}

/** Drops servers that no longer exist, adds new ones at the end, and dissolves empty or
    one-server folders. */
export function normalize(layout, serverIds) {
    const known = new Set(serverIds.map(String));
    const seen = new Set();
    const out = [];
    for (const entry of Array.isArray(layout) ? layout : []) {
        if (isFolder(entry)) {
            const ids = entry.ids.map(String).filter(id => known.has(id) && !seen.has(id));
            ids.forEach(id => seen.add(id));
            if (ids.length > 1) {
                out.push({ folder: String(entry.folder), name: String(entry.name ?? ''), color: String(entry.color ?? ''), open: !!entry.open, ids });
            } else if (ids.length === 1) {
                out.push(ids[0]);
            }
        } else if (known.has(String(entry)) && !seen.has(String(entry))) {
            seen.add(String(entry));
            out.push(String(entry));
        }
    }
    for (const id of serverIds.map(String)) {
        if (!seen.has(id)) {
            out.push(id);
        }
    }
    return out;
}

/** Where a server is: its index in the rail, and in its folder if it's in one. */
export function locate(layout, id) {
    for (let index = 0; index < layout.length; index++) {
        const entry = layout[index];
        if (isFolder(entry)) {
            const inner = entry.ids.indexOf(String(id));
            if (inner >= 0) {
                return { index, folder: entry.folder, inner };
            }
        } else if (entry === String(id)) {
            return { index, folder: null, inner: -1 };
        }
    }
    return null;
}

/** Takes a server out of wherever it is (dissolving a folder left with one server). */
function take(layout, id) {
    const out = [];
    for (const entry of layout) {
        if (isFolder(entry)) {
            const ids = entry.ids.filter(x => x !== String(id));
            if (ids.length > 1) {
                out.push({ ...entry, ids });
            } else if (ids.length === 1) {
                out.push(ids[0]);
            }
        } else if (entry !== String(id)) {
            out.push(entry);
        }
    }
    return out;
}

/**
 * Moves a server next to another, or into it (making a folder, or joining its folder).
 * @param {Entry[]} layout
 * @param {string} id The server dragged
 * @param {string} targetId A server, or a folder's id
 * @param {'before'|'after'|'into'} position
 * @param {() => string} [newFolderId]
 */
export function move(layout, id, targetId, position, newFolderId = () => `f${Date.now()}`) {
    id = String(id);
    targetId = String(targetId);
    if (id === targetId) {
        return copy(layout);
    }
    const source = locate(layout, id);
    if (!source) {
        return copy(layout);
    }
    // the folder itself as the target
    const folderIndex = layout.findIndex(entry => isFolder(entry) && entry.folder === targetId);
    let out = take(copy(layout), id);
    if (folderIndex >= 0) {
        const at = out.findIndex(entry => isFolder(entry) && entry.folder === targetId);
        if (at < 0) {
            // the folder dissolved when the server left it: put the server back beside what remains
            return out;
        }
        if (position === 'into') {
            out[at].ids.push(id);
        } else {
            out.splice(position === 'before' ? at : at + 1, 0, id);
        }
        return out;
    }
    const target = locate(out, targetId);
    if (!target) {
        return copy(layout);
    }
    if (target.folder) {
        const folder = /** @type {Folder} */ (out[target.index]);
        if (position === 'into') {
            folder.ids.push(id);
        } else {
            folder.ids.splice(position === 'before' ? target.inner : target.inner + 1, 0, id);
        }
        return out;
    }
    if (position === 'into') {
        out[target.index] = { folder: newFolderId(), name: '', color: '', open: false, ids: [targetId, id] };
        return out;
    }
    out.splice(position === 'before' ? target.index : target.index + 1, 0, id);
    return out;
}

/** Moves a server up or down one place (within its folder, if it's in one). */
export function step(layout, id, direction) {
    const where = locate(layout, id);
    if (!where) {
        return copy(layout);
    }
    const out = copy(layout);
    if (where.folder) {
        const ids = /** @type {Folder} */ (out[where.index]).ids;
        const to = where.inner + direction;
        if (to >= 0 && to < ids.length) {
            [ids[where.inner], ids[to]] = [ids[to], ids[where.inner]];
        }
        return out;
    }
    const to = where.index + direction;
    if (to >= 0 && to < out.length) {
        [out[where.index], out[to]] = [out[to], out[where.index]];
    }
    return out;
}

/** Takes a server out of its folder, placing it right after the folder. */
export function leaveFolder(layout, id) {
    const where = locate(layout, id);
    if (!where?.folder) {
        return copy(layout);
    }
    const out = take(copy(layout), id);
    const at = out.findIndex(entry => isFolder(entry) && entry.folder === where.folder);
    out.splice(at >= 0 ? at + 1 : where.index + 1, 0, String(id));
    return out;
}

/** Ungroups a folder, its servers taking its place in order. */
export function ungroup(layout, folderId) {
    return layout.flatMap(entry => (isFolder(entry) && entry.folder === String(folderId) ? [...entry.ids] : [entry]));
}

/** Changes a folder's name, color or open state. */
export function updateFolder(layout, folderId, changes) {
    return copy(layout).map(entry => (isFolder(entry) && entry.folder === String(folderId) ? { ...entry, ...changes } : entry));
}

/** Moves a whole folder before or after another entry of the rail (a server in a folder
    stands for its folder). */
export function moveFolder(layout, folderId, targetId, position) {
    const out = copy(layout);
    const from = out.findIndex(entry => isFolder(entry) && entry.folder === String(folderId));
    if (from < 0 || String(folderId) === String(targetId)) {
        return out;
    }
    const [folder] = out.splice(from, 1);
    let at = out.findIndex(entry => (isFolder(entry) ? entry.folder === String(targetId) || entry.ids.includes(String(targetId)) : entry === String(targetId)));
    if (at < 0) {
        out.splice(from, 0, folder);
        return out;
    }
    out.splice(position === 'before' ? at : at + 1, 0, folder);
    return out;
}

export { isFolder };
