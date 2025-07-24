import React from 'react';
import logo from '../assets/logo.png';
import heroBg from '../assets/land.png'; // Make sure this image exists

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <header className="w-full px-6 py-3 border-b bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="CampusSink Logo" className="h-9 w-auto" />
            <span className="text-xl font-bold text-blue-700">CampusSink</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-gray-700 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#dashboard" className="hover:text-blue-600 transition">Dashboard</a>
            <a href="#reviews" className="hover:text-blue-600 transition">Reviews</a>
          </nav>
          <a href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm">
              Login to Portal
            </button>
          </a>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section
        className="bg-cover bg-center bg-no-repeat py-32 text-white text-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="bg-black-50 py-10 px-6 rounded-lg inline-block backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-snug text-gray-900">
            <span className='text-red-700'>T</span>ran<span className='text-red-700'>s</span>form Your <span className='text-red-700'>C</span>ampus <br />
            <span className="text-blue-400"> <span className='text-blue-400'>M</span>anagement Experience</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg font-light text-gray-900">
            One platform to manage students, teachers, assignments, and performance — all in one place.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Designed for Every Role</h2>
        <p className="max-w-xl mx-auto text-gray-600 mb-12">
          Whether you're a student, teacher, or administrator — CampusSink empowers you with tools that matter.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Student */}
          <div className="bg-blue-100 hover:bg-blue-200 transition rounded-xl p-6 text-left shadow">
            <h3 className="text-lg font-semibold mb-2">For Students</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Access assignments</li>
              <li>Track grades</li>
              <li>Submit coursework</li>
              <li>Connect with teachers</li>
            </ul>
          </div>

          {/* Teacher */}
          <div className="bg-green-100 hover:bg-green-200 transition rounded-xl p-6 text-left shadow">
            <h3 className="text-lg font-semibold mb-2">For Teachers</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Create and manage tasks</li>
              <li>Grade submissions</li>
              <li>Analyze performance</li>
              <li>Manage classrooms</li>
            </ul>
          </div>

          {/* Admin */}
          <div className="bg-purple-100 hover:bg-purple-200 transition rounded-xl p-6 text-left shadow">
            <h3 className="text-lg font-semibold mb-2">For Administrators</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Advanced analytics</li>
              <li>User management</li>
              <li>System configuration</li>
              <li>Reporting tools</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Powerful Dashboard Experience</h2>
        <p className="text-gray-600 mb-12">Manage your academic data and workflows with ease.</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
          {/* Assignment Management */}
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h4 className="font-semibold mb-2">Assignment Management</h4>
            <div className="text-sm">
              <div className="flex justify-between text-gray-800">
                <span>Math Quiz #3</span>
                <span className="text-blue-600">24/30 submitted</span>
              </div>
              <div className="text-xs text-gray-500">Due: Today</div>
              <hr className="my-2" />
              <div className="flex justify-between text-gray-800">
                <span>Science Project</span>
                <span className="text-blue-600">12/30 submitted</span>
              </div>
              <div className="text-xs text-gray-500">Due: Next Week</div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-gray-50 p-6 rounded-xl shadow text-sm">
            <h4 className="font-semibold mb-2">Performance Analytics</h4>
            <div className="mb-2">
              <p>Assignment Completion</p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full w-[87%]" />
              </div>
            </div>
            <div className="mb-2">
              <p>Average Grade</p>
              <p className="text-blue-600 font-bold">B+</p>
            </div>
            <div>
              <p>Student Engagement</p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-purple-500 h-2 rounded-full w-[92%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Loved by Educators</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: "Dr.Sunita Barave",
              role: "High School Teacher",
              quote: "CampusSink transformed our classroom. Saved me hours every week!",
            },
            {
              name: "Dr.Mahesh Goudar",
              role: "School Administrator",
              quote: "The dashboard helps us detect and help struggling students faster.",
            },
            {
              name: "Shiva Ghyar",
              role: "College Student",
              quote: "Everything’s in one place. Makes life as a student easier!",
            },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow text-left">
              <p className="text-yellow-500 text-xl mb-2">★★★★★</p>
              <p className="text-sm text-gray-700 mb-4">"{t.quote}"</p>
              <p className="font-semibold text-gray-800">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c1327] text-white py-10 px-4 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-2">CampusSink</h4>
            <p>Empowering education with smart, modern academic tools.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-1">
              <li>Features</li>
              <li>Security</li>
              <li>Updates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Resources</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-10">© 2024 CampusSink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
