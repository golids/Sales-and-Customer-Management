document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'main.html';
    });

    // Chart initialization
    const ctx = document.getElementById('salesChart').getContext('2d');
    let salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Total Sales',
                data: [6500, 5900, 8000, 8100, 8600, 7550, 9000],
                borderColor: '#64ffda',
                backgroundColor: 'rgba(100, 255, 218, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ccd6f6'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                    },
                    ticks: {
                        color: '#ccd6f6'
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
        }
    });

    // Filter application
    document.getElementById('applyBtn').addEventListener('click', function() {
        const timePeriod = document.getElementById('timePeriod').value;
        const segmentBy = document.getElementById('segmentBy').value;
        const chartType = document.getElementById('chartType').value;
        
        // Update chart based on selections
        salesChart.destroy();
        
        // Sample data for demonstration
        let newData = {};
        if (segmentBy === 'none') {
            newData = {
                labels: getLabelsForPeriod(timePeriod),
                datasets: [{
                    label: 'Total Sales',
                    data: generateRandomData(timePeriod),
                    borderColor: '#64ffda',
                    backgroundColor: 'rgba(100, 255, 218, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            };
        } else {
            // Multi-dataset for segmented view
            newData = {
                labels: getLabelsForPeriod(timePeriod),
                datasets: getSegmentedData(segmentBy, timePeriod)
            };
        }
        
        salesChart = new Chart(ctx, {
            type: chartType === 'heatmap' ? 'bar' : chartType,
            data: newData,
            options: getChartOptions(chartType)
        });
        
        alert(`View updated to show ${timePeriod} trends segmented by ${segmentBy} in ${chartType} format`);
    });

    // Helper functions
    function getLabelsForPeriod(period) {
        switch(period) {
            case 'daily': return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'weekly': return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            case 'monthly': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            case 'seasonal': return ['Winter', 'Spring', 'Summer', 'Fall'];
            default: return [];
        }
    }

    function generateRandomData(period) {
        const base = period === 'daily' ? 100 : 
                    period === 'weekly' ? 500 : 
                    period === 'monthly' ? 2000 : 8000;
        const count = getLabelsForPeriod(period).length;
        return Array(count).fill().map(() => Math.floor(base + Math.random() * base * 0.5));
    }

    function getSegmentedData(segment, period) {
        const segments = {
            category: ['Electronics', 'Clothing', 'Home Goods', 'Accessories'],
            region: ['North', 'South', 'East', 'West'],
            customer: ['New', 'Returning', 'VIP', 'Corporate'],
            rep: ['Alex', 'Jamie', 'Taylor', 'Morgan']
        }[segment];
        
        const colors = ['#64ffda', '#ff6b6b', '#6391ff', '#ffb454'];
        
        return segments.map((seg, i) => ({
            label: seg,
            data: generateRandomData(period),
            borderColor: colors[i],
            backgroundColor: colors[i] + '33', // Add opacity
            borderWidth: 2,
            tension: 0.4
        }));
    }

    function getChartOptions(type) {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ccd6f6'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                    },
                    ticks: {
                        color: '#ccd6f6'
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
        
        if (type === 'heatmap') {
            return {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                return `Heat intensity: ${context.raw * 10}`;
                            }
                        }
                    }
                }
            };
        }
        
        return baseOptions;
    }
});