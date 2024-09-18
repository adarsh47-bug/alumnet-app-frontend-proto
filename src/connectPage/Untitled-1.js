// // src/pages/ConnectPage.js
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from '../axios'; // Axios instance with base URL set

// import Wrapper from '../components/Wrapper';
// import GroupCard from '../connectPage/GroupCard';
// import CreateGroupForm from '../connectPage/CreateGroupForm';
// import Sidebar from '../connectPage/Sidebar';
// import AlumniList from '../connectPage/AlumniList';
// import { navigation } from '../connectPage/navigation';
// import MessagingComponent from '../connectPage/MessagingComponent';

// const initialGroupsData = [
//   {
//     name: 'Group 1',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     icon: 'https://example.com/group1-icon.png',
//     members: 10,
//   },
//   {
//     name: 'Group 2',
//     description: 'Praesent euismod justo nec mauris consectetur, id lacinia ligula tincidunt.',
//     icon: 'https://example.com/group2-icon.png',
//     members: 5,
//   },
//   {
//     name: 'Group 3',
//     description: 'Nullam auctor elit at semper ultricies.',
//     icon: 'https://example.com/group3-icon.png',
//     members: 8,
//   },
// ];

// const ConnectPage = () => {
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState('Explore connections');
//   const [alumniData, setAlumniData] = useState([]);
//   const [groups, setGroups] = useState(initialGroupsData);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchAlumniData = async () => {
//       try {
//         const { data } = await axios.get('/api/users/connect'); // Fetch all users
//         setAlumniData(data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     // const fetchGroupsData = async () => {
//     //   try {
//     //     const { data } = await axios.get('/api/groups'); // Fetch all groups (Assume there's an endpoint)
//     //     setGroups(data);
//     //   } catch (error) {
//     //     console.error('Error fetching groups:', error);
//     //   }
//     // };

//     fetchAlumniData();
//     // fetchGroupsData();
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const tab = params.get('tab');
//     const userId = params.get('userId');
//     if (tab) {
//       setActiveTab(tab);
//       if (tab === 'Messaging' && userId) {
//         const user = alumniData.find(alumnus => alumnus._id === userId); // Use _id from MongoDB
//         if (user) {
//           setMessages(prevMessages => [
//             ...prevMessages,
//             { userId, name: user.name, profileImage: user.profileImg, message: `Started a conversation with ${user.name}` }
//           ]);
//         }
//       }
//     }
//   }, [location.search, alumniData]);

//   const handleConnect = (alumnus) => {
//     // Implement connection logic with database if required
//   };

//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };

//   const handleCreateGroup = (groupData) => {
//     // Add the created group to the state and the database
//     setGroups(prevGroups => [...prevGroups, groupData]);
//   };

//   const handleJoinGroup = (group) => {
//     setJoinedGroups(prevGroups => [...prevGroups, group]);
//   };

//   return (
//     <Wrapper>
//       <Sidebar
//         navigation={navigation}
//         activeTab={activeTab}
//         onTabClick={handleTabClick}
//       />
//       <div className="w-[80%] p-8">
//         <h1 className="text-3xl font-bold text-blue-800 mb-6">{activeTab}</h1>
//         {activeTab === 'My Groups' && (
//           <div>
//             <button
//               onClick={() => setShowCreateGroupForm(true)}
//               className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               Create Group
//             </button>
//             <ul className="flex flex-wrap">
//               {joinedGroups.map((group, index) => (
//                 <li key={index} className="m-2">
//                   <GroupCard group={group} onJoin={handleJoinGroup} isJoined={true} />
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         {activeTab === 'Explore Groups' && (
//           <div>
//             <ul className="flex flex-wrap">
//               {groups.map((group, index) => (
//                 <li key={index} className="m-2">
//                   <GroupCard group={group} onJoin={handleJoinGroup} isJoined={joinedGroups.includes(group)} />
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         {(activeTab === 'Explore connections') && (
//           <AlumniList
//             alumni={alumniData || []} // Use fetched data
//             isConnectedTab={activeTab === 'My connections'}
//             onConnect={handleConnect}
//           />
//         )}
//         {activeTab === 'Messaging' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Messages</h2>
//             {messages.length > 0 ? (
//               <ul>
//                 {messages.map((msg, index) => (
//                   <li key={index} className="mb-4">
//                     <MessagingComponent message={msg} />
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No messages yet.</p>
//             )}
//           </div>
//         )}
//       </div>
//       {showCreateGroupForm && <CreateGroupForm onCreateGroup={handleCreateGroup} onClose={() => setShowCreateGroupForm(false)} />}
//     </Wrapper>
//   );
// };

// export default ConnectPage;
