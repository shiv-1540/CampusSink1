import React from 'react';
import logo from '../assets/logo.png';
import heroBg from '../assets/land.png'; // Make sure this image exists
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { CheckCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid'; // example icons

const FeaturePoint = ({ text }) => (
  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
    <ArrowRightCircleIcon className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
    <span>{text}</span>
  </li>
);



const LandingPage = () => {
  const navigate=useNavigate();

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <header className="w-full px-6 py-3 border-b bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <img src={logo} alt="CampusSink Logo" className="h-9 w-auto" /> */}
            <span className="text-xl font-bold text-blue-700">CampusSink</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-gray-700 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#dashboard" className="hover:text-blue-600 transition">Dashboard</a>
            <a href="#reviews" className="hover:text-blue-600 transition">Reviews</a>
          </nav>
          
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm" onClick={()=>navigate('/login')}>
              Login to Portal
            </button>
        
        </div>
      </header>

      {/* Hero Section with Background */}
     <section
      className="relative bg-cover bg-center bg-no-repeat py-32 text-white"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Overlay for improved readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="text-red-600">T</span>ran<span className="text-red-600">s</span>form Your{" "}
          <span className="text-red-600">C</span>ampus <br />
          <span className="text-blue-300">Management Experience</span>
        </h1>
        <p className="text-lg md:text-xl font-light text-gray-200 mb-8">
          One platform to manage students, teachers, assignments, and performance — all in one place.
        </p>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors duration-200"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </div>
</section>

<section id="features" className="flex flex-col justify-center py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-gray-50 text-center">
  <h2 className="text-[clamp(1.8rem,5vw,2.5rem)] font-extrabold mb-6 text-gray-800 leading-tight">
    Empowering Every Role, Seamlessly
  </h2>
  <p className="max-w-2xl mx-auto text-gray-600 mb-12 text-base sm:text-lg">
    CampusSink adapts to your unique academic journey—whether you’re a student, teacher, or admin.
  </p>

  <div className="flex flex-col gap-8 md:grid md:grid-cols-3 max-w-7xl mx-auto text-left">
    {/* Student Card */}
    <div className="flex flex-col justify-center bg-white border-t-4 border-blue-500 rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-1">For Students</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Stay on top of every deadline, effortlessly.</p>
      <ul className="space-y-2">
        <FeaturePoint text="Centralized deadline tracking" />
        <FeaturePoint text="Email & WhatsApp reminders" />
        <FeaturePoint text="Daily AI workload suggestions" />
        <FeaturePoint text="Track submitted & pending work" />
      </ul>
    </div>

    {/* Teacher Card */}
    <div className="bg-white border-t-4 border-green-500 rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <h3 className="text-xl sm:text-2xl font-semibold text-green-700 mb-1">For Teachers</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Plan better with insights and clarity.</p>
      <ul className="space-y-2">
        <FeaturePoint text="Analyze student workload" />
        <FeaturePoint text="Plan academic tasks class-wise" />
        <FeaturePoint text="Sync with academic calendar" />
        <FeaturePoint text="Track assignment edits & reviews" />
      </ul>
    </div>

    {/* Admin Card */}
    <div className="bg-white border-t-4 border-purple-500 rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-1">For Admins</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Gain full control with actionable insights.</p>
      <ul className="space-y-2">
        <FeaturePoint text="Visual analytics of workload" />
        <FeaturePoint text="User & permissions management" />
        <FeaturePoint text="System-wide configurations" />
        <FeaturePoint text="Integrated reporting tools" />
      </ul>
    </div>
  </div>
</section>
   {/*  How it works  */}
    <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-20 bg-white text-gray-800">
      <div className="text-center mb-12">
        <h2 className="text-[clamp(1.8rem,5vw,2.5rem)] font-extrabold leading-tight text-black-700">
          How It Works for Students
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-base sm:text-lg mt-2">
          A simplified flow from sign-in to submission & smart reminders 🚀
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-10">
        {/* Step 1 */}
        <div className="relative pl-10">
          <div className="absolute left-0 top-0 h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-full shadow-md">
            1
          </div>
          <h4 className="text-xl font-semibold mb-2">Sign In</h4>
          <p className="text-gray-600">
            Use your college-provided <strong>PRN, Email & Password</strong> to access the portal. Option to update password after first login.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative pl-10">
          <div className="absolute left-0 top-0 h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-full shadow-md">
            2
          </div>
          <h4 className="text-xl font-semibold mb-2">Access Dashboard</h4>
          <p className="text-gray-600">
            After login, get directed to a personalized dashboard showing your academic overview.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative pl-10">
          <div className="absolute left-0 top-0 h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-full shadow-md">
            3
          </div>
          <h4 className="text-xl font-semibold mb-2">View Active Assignments</h4>
          <p className="text-gray-600">
            Instantly view <strong>live assignments</strong> and pending submissions, project reviews, and seminars.
          </p>
        </div>

        {/* Step 4 */}
        <div className="relative pl-10">
          <div className="absolute left-0 top-0 h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-full shadow-md">
            4
          </div>
          <h4 className="text-xl font-semibold mb-2">Track & Submit</h4>
          <p className="text-gray-600">
            Keep track of <strong>submitted & pending</strong> tasks. Get smart AI-based suggestions to help manage your workload.
          </p>
        </div>

        {/* Step 5 */}
        <div className="relative pl-10 col-span-2">
          <div className="absolute left-0 top-0 h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-full shadow-md">
            5
          </div>
          <h4 className="text-xl font-semibold mb-2">Smart Notifications</h4>
          <p className="text-gray-600">
            Receive instant alerts and reminders on <strong>WhatsApp</strong> & <strong>Email</strong> before deadlines hit.
          </p>
        </div>
      </div>

      {/* Optional arrow flow visual line */}
      <div className="hidden md:block absolute left-8 top-40 h-[calc(100%-80px)] w-0.5 bg-blue-200 rounded-full z-0"></div>
    </section>


      {/* Dashboard Preview */}
   <section id="dashboard" className="py-20 px-6 md:px-12 bg-white text-gray-800">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-black-700">Unified Dashboard Overview</h2>
    <p className="text-gray-600 max-w-2xl mx-auto mt-2">
      A centralized view for Admins, Teachers, and Students to manage academics, deadlines, and performance.
    </p>
  </div>

  <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">

    {/* Admin: Department-wise Analysis */}
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h4 className="font-semibold text-lg text-gray-800 mb-4">Department-Wise Overview</h4>
      <ul className="text-sm space-y-2">
        <li className="flex justify-between">
          <span>Computer Engineering</span>
          <span className="text-blue-600 font-semibold">342 Students</span>
        </li>
        <li className="flex justify-between">
          <span>Information Technology</span>
          <span className="text-green-600 font-semibold">295 Students</span>
        </li>
        <li className="flex justify-between">
          <span>Electronics</span>
          <span className="text-purple-600 font-semibold">218 Students</span>
        </li>
        <li className="flex justify-between">
          <span>Chemical Engineering</span>
          <span className="text-pink-600 font-semibold">185 Students</span>
        </li>
      </ul>
    </div>

    {/* Teacher/Student: Calendar */}
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h4 className="font-semibold text-lg text-gray-800 mb-4">Smart Academic Calendar</h4>
      <div className="text-sm text-gray-700">
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Aug 1 – Internal Exam Week</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Aug 10 – Seminar Submissions</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Aug 20 – Major Project Demo</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Aug 28 – Attendance Cut-Off</span>
          </li>
        </ul>
      </div>
    </div>

    {/* General: Dashboard Stats */}
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h4 className="font-semibold text-lg text-gray-800 mb-4">Quick Stats</h4>
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <p className="mb-1">Assignment Completion</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 w-[87%] rounded-full" />
          </div>
        </div>
        <div>
          <p className="mb-1">Student Engagement</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-purple-500 h-2 w-[92%] rounded-full" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span>Average Grade</span>
          <span className="text-blue-600 font-semibold">B+</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="features" className="flex flex-col justify-center py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-gray-50 text-center">
  <h2 className="text-[clamp(1.8rem,5vw,2.5rem)] font-extrabold mb-6 text-gray-800 leading-tight">
    Empowering Every Role, Seamlessly
  </h2>
  <p className="max-w-2xl mx-auto text-gray-600 mb-12 text-base sm:text-lg">
    CampusSink adapts to your unique academic journey—whether you’re a student, teacher, or admin.
  </p>
</section>

  {/* Testimonials Section */}
<section id="reviews" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-extrabold mb-4 text-gray-800">Loved by Educators & Students</h2>
    <p className="text-gray-600 mb-12 text-lg">What our users say about CampusSink</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[
        {
          name: "Dr. Sunita Barave",
          role: "High School Teacher",
          quote: "CampusSink transformed our classroom. Saved me hours every week!",
        },
        {
          name: "Dr. Mahesh Goudar",
          role: "School Administrator",
          quote: "The dashboard helps us detect and help struggling students faster.",
        },
        {
          name: "Shiva Ghyar",
          role: "College Student",
          quote: "Everything’s in one place. Makes life as a student easier!",
        },
      ].map((t, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <p className="text-yellow-500 text-2xl mb-3">★★★★★</p>
          <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
          <div className="border-t pt-3">
            <p className="font-semibold text-gray-800">{t.name}</p>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
          <h4 className="text-xl font-semibold mb-2">Sign In</h4>
          <p className="text-gray-600">
            Use your college-provided <strong>PRN, Email & Password</strong> to access the portal. Option to update password after first login.
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


  <footer className="bg-[#0c1327] text-white py-12 px-6 text-sm">
   <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
    
    {/* Branding Section */}
    <div>
      <h4 className="text-2xl font-bold mb-3 text-gradient bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
        CampusSink
      </h4>
      <p className="text-gray-400 leading-relaxed">
        Empowering education with smart, modern academic tools to support students and educators.
      </p>
    </div>

    {/* Product */}
    <div>
      <h4 className="font-semibold text-white mb-3 uppercase tracking-wider">Product</h4>
      <ul className="space-y-2 text-gray-400 hover:text-white transition-all">
        <li className="hover:text-white cursor-pointer">Features</li>
        <li className="hover:text-white cursor-pointer">Security</li>
        <li className="hover:text-white cursor-pointer">Updates</li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h4 className="font-semibold text-white mb-3 uppercase tracking-wider">Support</h4>
      <ul className="space-y-2 text-gray-400">
        <li className="hover:text-white cursor-pointer">Help Center</li>
        <li className="hover:text-white cursor-pointer">Contact Us</li>
        <li className="hover:text-white cursor-pointer">Resources</li>
      </ul>
    </div>

    {/* Company */}
    <div>
      <h4 className="font-semibold text-white mb-3 uppercase tracking-wider">Company</h4>
      <ul className="space-y-2 text-gray-400">
        <li className="hover:text-white cursor-pointer">About</li>
        <li className="hover:text-white cursor-pointer">Careers</li>
        <li className="hover:text-white cursor-pointer">Blog</li>
      </ul>
    </div>
  </div>

  {/* Divider Line */}
  <div className="border-t border-gray-700 mt-10 pt-6 text-center">
    <p className="text-gray-500 text-sm">
      © 2024 CampusSink. All rights reserved.
    </p>
  </div>
</footer>

    </div>
  );
};

export default LandingPage;
