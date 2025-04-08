import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL, // or your backend URL
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
