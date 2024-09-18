// // src/connectPage/ExploreConnections.js
// import React, { useEffect, useState } from 'react';
// import AlumniList from '../connectPage/AlumniList';
// import axios from '../axios';

// const ExploreConnections = ({ config }) => {
//   const [alumniData, setAlumniData] = useState([]);

//   useEffect(() => {
//     const fetchAlumniData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No token found');
//         const config = {
//           headers: { Authorization: `Bearer ${token}` },
//         };
//         const { data } = await axios.get('/api/users/connect', config); // Fetch all users
//         setAlumniData(data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
//     fetchAlumniData();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">Explore Connections</h1>
//       <AlumniList
//         alumni={alumniData}
//         isConnectedTab={false}
//         onSendRequest={handleSendConnectionRequest}
//       // Pass other necessary props
//       />
//     </div>
//   );
// };

// export default ExploreConnections;
