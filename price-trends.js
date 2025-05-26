document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'main.html';
    });

    // Toggle custom date range
    document.getElementById('timeRange').addEventListener('change', function() {
        document.getElementById('customRangeGroup').style.display = 
            this.value === 'custom' ? 'block' : 'none';
    });

    // Initialize main price trend chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(priceCtx, {
        type: 'line',
        data: getPriceTrendData(),
        options: getChartOptions('Price Trends')
    });

    // Initialize price-volume correlation chart
    const priceVolumeCtx = document.getElementById('priceVolumeChart').getContext('2d');
    const priceVolumeChart = new Chart(priceVolumeCtx, {
        type: 'scatter',
        data: getPriceVolumeData(),
        options: getChartOptions('Price vs Volume')
    });

    // Initialize margin trend chart
    const marginCtx = document.getElementById('marginChart').getContext('2d');
    const marginChart = new Chart(marginCtx, {
        type: 'bar',
        data: getMarginData(),
        options: getChartOptions('Margin Trends', true)
    });

    // Filter application
    document.getElementById('applyBtn').addEventListener('click', function() {
        const product = document.getElementById('productSelect').value;
        const timeRange = document.getElementById('timeRange').value;
        
        // Update charts with new data
        priceChart.data = getPriceTrendData(product, timeRange);
        priceChart.update();
        
        priceVolumeChart.data = getPriceVolumeData(product, timeRange);
        priceVolumeChart.update();
        
        marginChart.data = getMarginData(product, timeRange);
        marginChart.update();
        
        updateInsights(product, timeRange);
    });

    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', function() {
        alert('Exporting price trend data...\n\nThis would generate a CSV in a real application.');
    });

    // Helper functions
    function getPriceTrendData(product = 'all', range = '6m') {
        const labels = getTimeLabels(range);
        return {
            labels: labels,
            datasets: [{
                label: 'Average Price',
                data: generateRandomData(labels.length, 50, 150),
                borderColor: '#64ffda',
                backgroundColor: 'rgba(100, 255, 218, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                yAxisID: 'y'
            }, {
                label: 'Discount Rate',
                data: generateRandomData(labels.length, 0, 30),
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: false,
                yAxisID: 'y1'
            }]
        };
    }

    function getPriceVolumeData(product = 'all', range = '6m') {
        const points = 15;
        return {
            datasets: [{
                label: 'Price vs Volume',
                data: Array(points).fill().map(() => ({
                    x: Math.random() * 100 + 50,
                    y: Math.random() * 500 + 100
                })),
                backgroundColor: '#6391ff',
                borderColor: '#6391ff',
                borderWidth: 1
            }]
        };
    }

    function getMarginData(product = 'all', range = '6m') {
        const labels = getTimeLabels(range);
        return {
            labels: labels,
            datasets: [{
                label: 'Gross Margin %',
                data: generateRandomData(labels.length, 20, 45),
                backgroundColor: '#ffb454',
                borderColor: '#ffb454',
                borderWidth: 1
            }]
        };
    }

    function getChartOptions(title, isBar = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#64ffda',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: '#ccd6f6'
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 30,
                            yMax: 30,
                            borderColor: 'rgb(255, 107, 107)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                content: 'Target Margin',
                                enabled: true,
                                position: 'right',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#fff'
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: isBar ? true : false,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                    },
                    ticks: {
                        color: '#ccd6f6'
                    }
                },
                y1: {
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#ff6b6b'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                    },
                    ticks: {
                        color: '#ccd6f6'
                    }
                }
            }
        };
    }

    function getTimeLabels(range) {
        switch(range) {
            case '3m': return ['Month 1', 'Month 2', 'Month 3'];
            case '6m': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            case '12m': return Array(12).fill().map((_,i) => new Date(0, i).toLocaleString('default', {month:'short'}));
            default: return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        }
    }

    function generateRandomData(count, min, max) {
        return Array(count).fill().map(() => Math.floor(min + Math.random() * (max - min)));
    }

    function updateInsights(product, range) {
        // Simulate different insights based on filters
        const optimalPrices = {
            all: 89.99,
            electronics: 199.99,
            apparel: 39.99,
            home: 59.99,
            accessories: 24.99
        };
        
        document.querySelector('.insight-value').textContent = `$${optimalPrices[product]}`;
    }
});