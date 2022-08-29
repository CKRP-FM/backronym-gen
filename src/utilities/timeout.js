function timeout(timeoutFn, time) {
    return setTimeout(() => {
        timeoutFn();
    }, time);
}

export default timeout;