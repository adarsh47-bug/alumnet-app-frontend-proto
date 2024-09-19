// src/pages/CoursesPage.js
import React, { useState, useRef, useEffect } from 'react';
import Wrapper from '../components/Wrapper';

const CourseCard = ({ course, onPurchase }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
    <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
    <div className="p-4 flex-grow">
      <h3 className="text-xl font-semibold text-blue-700">{course.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
      <div className="flex items-center mt-4">
        <span className="text-yellow-500">{'★'.repeat(course.rating)}</span>
        <span className="text-gray-500 ml-2">({course.rating})</span>
      </div>
      <p className="text-gray-500 mt-2">{course.purchases} people have purchased this course</p>
    </div>
    <div className="p-4 bg-gray-50 flex justify-between items-center">
      <button
        onClick={onPurchase}
        className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-700"
      >
        Purchase
      </button>
    </div>
  </div>
);

const navigation = [
  { name: 'All Resources' },
  { name: 'My Resources' },
  {
    name: 'Types of Resources',
    options: [
      { name: 'Web Development Resources' },
      { name: 'Data Science Resources' },
      { name: 'Mobile App Development Resources' },
      { name: 'Artificial Intelligence Resources' },
      { name: 'Cloud Computing Resources' },
      { name: 'Cybersecurity Resources' },
      { name: 'Digital Marketing Resources' },
      { name: 'Graphic Design Resources' },
      { name: 'Project Management Resources' },
      { name: 'Business Analytics Resources' }
    ]
  },
];

const Sidebar = ({ navigation, activeCategory, onCategoryClick }) => (
  <div className="w-[20%] flex h-screen flex-col justify-between border-e bg-white max-sm:w-[100%] max-sm:h-fit">
    <div className="px-4 py-6">
      <ul className="mt-6 space-y-1">
        {navigation.map((item, index) => (
          <li key={index}>
            {item.options ? (
              <details className="group [&_summary::-webkit-details-marker]:hidden" open={window.innerWidth > 640}>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                {/* Submenu for options */}
                <ul className="mt-2 space-y-1 px-4">
                  {item.options.map((subItem, subIndex) => (
                    <li key={subIndex} className='flex flex-row items-center'>
                      <button
                        onClick={() => onCategoryClick(subItem.name)}
                        className={`block w-full text-left rounded-lg px-4 py-2 text-sm font-medium ${activeCategory === subItem.name ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                      >
                        {subItem.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <button
                onClick={() => onCategoryClick(item.name)}
                className={`block w-full text-left rounded-lg px-4 py-2 text-sm font-medium ${activeCategory === item.name ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
              >
                {item.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const CoursesData = [
  {
    title: 'React for Beginners',
    description: 'Learn the basics of React and build your first web application.',
    imageUrl: 'https://www.ecured.cu/images/thumb/a/a6/React-logo.png/1200px-React-logo.png',
    rating: 4,
    purchases: 120,
    category: 'Web Development Resources',
    isPurchased: false,
  },
  {
    title: 'Data Science with Python',
    description: 'An in-depth course on data science using Python.',
    imageUrl: 'https://gamakaai.com/wp-content/uploads/2020/07/DS-With-Python-Banner.jpg',
    rating: 5,
    purchases: 200,
    category: 'Data Science Resources',
    isPurchased: false,
  },
  {
    title: 'Mobile App Development with Flutter',
    description: 'Build beautiful mobile applications using Flutter.',
    imageUrl: 'https://cdn.prod.website-files.com/5f841209f4e71b2d70034471/6078b650748b8558d46ffb7f_Flutter%20app%20development.png',
    rating: 4,
    purchases: 80,
    category: 'Mobile App Development Resources',
    isPurchased: false,
  },
];

const CoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [courses, setCourses] = useState(CoursesData);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handlePurchase = (index) => {
    const updatedCourses = [...courses];
    updatedCourses[index].isPurchased = true;
    updatedCourses[index].purchases += 1;
    setCourses(updatedCourses);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupVisible]);

  const AddCourseForm = () => (
    <form className="p-6 mb-6 h-[70vh] max-sm:h-[65vh] sm:overflow-auto max-sm:p-2">
      {['title', 'description', 'imageUrl'].map((field) => (
        <div className="mb-4" key={field}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            id={field}
            name={field}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${field === 'description' ? 'h-28 max-sm:h-16' : 'h-14 max-sm:h-12'} `}
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {navigation.slice(2).map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-6 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Publish Resource
      </button>
    </form>
  );

  const filteredCourses = activeCategory === 'All Resources'
    ? courses
    : activeCategory === 'My Resources'
      ? courses.filter(course => course.isPurchased)
      : courses.filter(course => course.category === activeCategory);

  return (
    <Wrapper>
      <div className="flex w-[100%] max-sm:flex-col">
        <Sidebar navigation={navigation} activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />
        <div className="w-[80%] p-8 max-sm:w-[100%] max-sm:p-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">{activeCategory}</h1>
            <button
              onClick={togglePopup}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 max-sm:px-2 max-sm:mx-1 rounded flex items-center"
            >
              <span className='max-sm:hidden'> Publish Resources</span>
              <span class="material-icons">
                publish
              </span>
            </button>
          </div>

          {isPopupVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-lg relative w-[50%] max-sm:w-[100%] max-sm:h-fit scale-[90%]">
                <div className='px-6'>
                  <h2 className="text-xl font-bold mb-4">Publish New Resources</h2>
                  <button
                    className="absolute top-2 right-2 border border-gray-500 rounded-lg px-2 py-1 mb-2 hover:bg-red-500"
                    onClick={togglePopup}
                  >
                    Close
                  </button>
                </div>
                <AddCourseForm />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div className="h-full" key={index}>
                <CourseCard
                  course={course}
                  onPurchase={() => handlePurchase(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CoursesPage;