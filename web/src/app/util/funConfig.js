export const sortArray = (tempArr) => {
    const sortedArr = tempArr.sort(function(a,b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a == b) return 0;
        if (a > b) return 1;
        return -1;
    })
    return sortedArr
}