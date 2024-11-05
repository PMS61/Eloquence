import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceChart = ({ performanceData }) => {
    const { labels, paceData, modulationData, clarityData } = performanceData;

    const data = {
        labels: labels, // e.g., session dates or numbers
        datasets: [
            {
                label: 'Pace',
                data: paceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Modulation',
                data: modulationData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Clarity',
                data: clarityData,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Performance Over Time',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Session',
                },
            },
        },
    };

    return (
        
        <div className="w-full border-2 rounded-md p-2 ">
            <Line data={data} options={options} />
        </div>
        
    );
};

export default PerformanceChart;
