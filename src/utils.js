function randomSelection(str, obj) {
    if (Array.isArray(obj)) {
        let len = Math.floor(Math.random() * obj.length)
        while (obj[len] === str) {
            len = Math.floor(Math.random() * obj.length)
        }
        return obj[len]
    } else {
        return obj
    }
}

export default randomSelection;
