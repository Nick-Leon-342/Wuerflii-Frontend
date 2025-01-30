

import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
)

// const Counts = {
//     "2000": {"1": 80, "2": 1, "3": 72, "4": 4, "5": 78, "6": 52, "7": 91, "8": 37, "9": 29, "10": 49, "11": 73, "12": 56},
//     "2001": {"1": 66, "2": 15, "3": 1, "4": 55, "5": 64, "6": 37, "7": 8, "8": 68, "9": 21, "10": 6, "11": 63, "12": 44},
//     "2002": {"1": 14, "2": 9, "3": 86, "4": 74, "5": 70, "6": 69, "7": 27, "8": 97, "9": 35, "10": 70, "11": 36, "12": 44},
// 		// "2003": {"1": 1, "2": 28, "3": 19, "4": 35, "5": 50, "6": 45, "7": 74, "8": 75, "9": 86, "10": 13, "11": 5, "12": 73},
// 		// "2004": {"1": 33, "2": 64, "3": 38, "4": 23, "5": 75, "6": 79, "7": 77, "8": 42, "9": 50, "10": 4, "11": 78, "12": 72},
// 		// "2005": {"1": 60, "2": 18, "3": 46, "4": 34, "5": 67, "6": 72, "7": 30, "8": 24, "9": 85, "10": 55, "11": 64, "12": 43},
// 		// "2006": {"1": 74, "2": 65, "3": 39, "4": 73, "5": 82, "6": 91, "7": 28, "8": 45, "9": 96, "10": 77, "11": 69, "12": 58},
// 		// "2007": {"1": 41, "2": 23, "3": 2, "4": 96, "5": 34, "6": 6, "7": 10, "8": 61, "9": 36, "10": 20, "11": 48, "12": 24},
// 		// "2008": {"1": 79, "2": 23, "3": 55, "4": 12, "5": 3, "6": 42, "7": 19, "8": 21, "9": 90, "10": 94, "11": 64, "12": 50},
// 		// "2009": {"1": 84, "2": 76, "3": 52, "4": 34, "5": 42, "6": 32, "7": 82, "8": 19, "9": 57, "10": 67, "11": 26, "12": 11},
// 		// "2010": {"1": 66, "2": 64, "3": 100, "4": 77, "5": 38, "6": 10, "7": 94, "8": 22, "9": 80, "10": 13, "11": 77, "12": 60},
// 		// "2011": {"1": 3, "2": 32, "3": 14, "4": 84, "5": 46, "6": 49, "7": 26, "8": 73, "9": 98, "10": 9, "11": 44, "12": 13},
// 		// "2012": {"1": 97, "2": 2, "3": 61, "4": 28, "5": 20, "6": 25, "7": 36, "8": 11, "9": 79, "10": 36, "11": 30, "12": 52},
// 		// "2013": {"1": 0, "2": 75, "3": 46, "4": 11, "5": 89, "6": 36, "7": 91, "8": 76, "9": 16, "10": 46, "11": 23, "12": 67},
// 		// "2014": {"1": 3, "2": 66, "3": 11, "4": 49, "5": 88, "6": 35, "7": 60, "8": 17, "9": 71, "10": 59, "11": 2, "12": 24},
// 		// "2015": {"1": 64, "2": 42, "3": 33, "4": 71, "5": 12, "6": 29, "7": 56, "8": 85, "9": 85, "10": 64, "11": 25, "12": 78},
// 		// "2016": {"1": 100, "2": 64, "3": 0, "4": 68, "5": 25, "6": 25, "7": 12, "8": 35, "9": 47, "10": 9, "11": 70, "12": 13},
// 		// "2017": {"1": 80, "2": 55, "3": 40, "4": 25, "5": 20, "6": 73, "7": 43, "8": 49, "9": 37, "10": 25, "11": 20, "12": 0},
// 		// "2018": {"1": 94, "2": 64, "3": 54, "4": 100, "5": 0, "6": 70, "7": 64, "8": 87, "9": 22, "10": 98, "11": 88, "12": 32},
// 		// "2019": {"1": 44, "2": 24, "3": 11, "4": 29, "5": 33, "6": 75, "7": 41, "8": 40, "9": 53, "10": 28, "11": 38, "12": 60}
// }

const Counts = {
	2020: {
	  "Total": 287,
	  1: {
		"Total": 58,
		"2": 10,
		"5": 15,
		"12": 18,
		"25": 15
	  },
	  4: {
		"Total": 72,
		"3": 30,
		"10": 22,
		"18": 10,
		"29": 10
	  }
	},
	2021: {
	  "Total": 315,
	  2: {
		"Total": 85,
		"1": 25,
		"7": 30,
		"15": 20,
		"23": 10
	  },
	  6: {
		"Total": 90,
		"5": 35,
		"12": 25,
		"20": 20,
		"28": 10
	  }
	},
	2022: {
	  "Total": 400,
	  3: {
		"Total": 110,
		"2": 40,
		"9": 30,
		"16": 20,
		"27": 20
	  },
	  7: {
		"Total": 140,
		"6": 50,
		"14": 40,
		"21": 30,
		"30": 20
	  }
	},
	2023: {
	  "Total": 375,
	  5: {
		"Total": 95,
		"3": 35,
		"11": 25,
		"19": 20,
		"24": 15
	  },
	  8: {
		"Total": 130,
		"4": 45,
		"13": 40,
		"22": 25,
		"29": 20
	  }
	},
	2024: {
	  "Total": 410,
	  9: {
		"Total": 120,
		"5": 40,
		"10": 30,
		"18": 25,
		"26": 25
	  },
	  11: {
		"Total": 140,
		"7": 50,
		"15": 40,
		"23": 30,
		"30": 20
	  }
	}
  }
  
  






export default function Chart_Bar({
	// Counts, 

	// statistics_view, 
	// statistics_view_year, 
	// statistics_view_month, 
}) {

	const statistics = [ 'statistics_days_of_month', 'statistics_months_of_year', 'statistics_years' ]

	const statistics_view = 'statistics_months_of_year'
	const statistics_view_year = 2024
	const statistics_view_month = 4

	const [ labels, setLabels ] = useState([])
	const [ values, setValues ] = useState([])

	const labels_months = [
		'Januar', 
		'Februar', 
		'März', 
		'April', 
		'Mai', 
		'Juni', 
		'Juli', 
		'August', 
		'September', 
		'Oktober', 
		'November', 
		'Dezember', 
	]


	useEffect(() => {

		if(!Counts) return 

		
		let tmp_labels = []
		let tmp_values = []

		if(statistics_view === 'statistics_years') {
			for(const year of Object.keys(Counts)) {
				tmp_labels.push(year)
				tmp_values.push(Counts[year].Total)
			}
		}

		if(statistics_view === 'statistics_months_of_year') {
			tmp_labels = labels_months
			for(const year of Object.keys(Counts)) {
				if(+year !== statistics_view_year) continue

				for(let i = 1; labels_months.length > i; i++) {
					const month = Counts[year][i]
					console.log(i, month)
					if(!month) {
						tmp_values.push(0)
					} else {
						tmp_values.push(month.Total)
					}
				}

				break
			}
		}



		

		setValues(tmp_values)
		setLabels(tmp_labels)

		// eslint-disable-next-line
	}, [ Counts, statistics_view ])


  
	const chartData = {
    	labels,
    	datasets: [{
        	label: 'Counts',
			data: values,
			backgroundColor: 'rgba(75, 192, 192, 0.5)',
			borderColor: 'rgba(75, 192, 192, 1)',
			borderWidth: 1,
    	}]
	}

	const options = {
		responsive: true,
		// indexAxis: 'y', 
		scales: {
			x: {
				// title: {
				// 	display: true,
				// 	text: 'Month',
				// },
			},
			y: {
				title: {
					display: true,
					text: 'Spiele gespielt',
				},
				beginAtZero: true,
			},
		},
	}





	return <>
		<Bar 
			data={chartData} 
			options={options} 
		/>
	</>
}