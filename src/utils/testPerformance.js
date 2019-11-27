const testPerformance = () => {
    return new Promise((resolve, reject) => {
        const times = [];
        let progressive = 0;
        let average = 0;
        const startTestingPerformance = () => {
            window.requestAnimationFrame(() => {
                const now = performance.now();
                while (times.length > 0 && times[0] <= now - 1000) {
                    times.shift();
                }
                times.push(now);
                progressive += 1;
                average = Math.round((average + times.length) / 2);
                if (progressive < 100) {
                    startTestingPerformance();
                } else {
                    resolve(average);
                }
            });
        };
        startTestingPerformance();
    });
};

export default testPerformance;
