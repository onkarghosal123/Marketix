import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000" : "/",   //Vite automatically provides several environment variables.
  withCredentials: true,
});

// Command        import.meta.env.MODE        baseURL

// npm run dev   =>   "development"    =>    http://localhost:3000
// npm run build =>   "production"     =>         "/"