import React from 'react';

import logo from '../assets/logo.png'

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
     <header className="w-full px-6 py-3 border-b shadow-sm bg-white sticky top-0 z-50">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo + Brand */}
    <div className="flex items-center gap-2">
      <img src={logo} alt="CampusSink Logo" className="h-8 w-auto" />
      <span className="text-xl font-bold text-gray-800">CampusSink</span>
    </div>

    {/* Navigation - hidden on small screens */}
    <nav className="hidden md:flex items-center gap-8 text-gray-600 text-sm font-medium">
      <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
      <a href="#dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
      <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
    </nav>

    {/* Login Button */}
    <a href="/login" className="ml-4">
      <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow">
        Login to Portal
      </button>
    </a>

    {/* Mobile Menu Icon (Optional for future use) */}
    {/* <div className="md:hidden">
      <MenuIcon />
    </div> */}
  </div>
     </header>


     {/* Hero Section */}
<section className="text-center py-20 bg-[#f8faff]">
  <h1 className="text-4xl font-bold mb-2">
    Transform Your Campus <br />
    <span className="text-blue-600">Management Experience</span>
  </h1>
  <p className="max-w-2xl mx-auto text-gray-600 mt-4">
    CampusSink is the comprehensive academic management portal that connects students, teachers, and administrators in one powerful platform.
  </p>

  {/* Informative Text - Student Workload */}
  <div className="mt-8 max-w-xl mx-auto bg-blue-50 p-4 rounded-xl shadow-sm">
    <div className="flex items-center justify-center gap-3 text-blue-700 font-semibold text-lg">
      📚 Student Workload Insight
    </div>
    <p className="text-gray-700 mt-2 text-sm">
      View upcoming assignments, track submissions, and stay ahead with your coursework schedule. Empower students with a clear overview of their academic responsibilities.
    </p>
  </div>
</section>


      {/* Roles Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Designed for Every Role</h2>
        <p className="text-gray-600 mb-10">Whether you're a student, teacher, or administrator, CampusSink provides tailored tools for your specific needs.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Student Card */}
          <div className="bg-blue-50 rounded-xl p-6 text-left shadow-sm">
            <h3 className="text-lg font-bold mb-2">For Students</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Access assignments and coursework</li>
              <li>Track grades and progress</li>
              <li>Submit work digitally</li>
              <li>Communication with teachers</li>
            </ul>
          </div>
          {/* Teacher Card */}
          <div className="bg-green-50 rounded-xl p-6 text-left shadow-sm">
            <h3 className="text-lg font-bold mb-2">For Teachers</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Create and manage assignments</li>
              <li>Grade submissions efficiently</li>
              <li>Track student performance</li>
              <li>Classroom management tools</li>
            </ul>
          </div>
          {/* Admin Card */}
          <div className="bg-purple-50 rounded-xl p-6 text-left shadow-sm">
            <h3 className="text-lg font-bold mb-2">For Administrators</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Institution-wide analytics</li>
              <li>User management system</li>
              <li>Performance reporting</li>
              <li>System configuration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-white text-center" id="dashboard">
        <h2 className="text-2xl font-semibold mb-2">Powerful Dashboard Experience</h2>
        <p className="text-gray-600 mb-10">Get a glimpse of the intuitive interfaces designed to make academic management effortless.</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
          {/* Assignment Management */}
          <div>
            <h4 className="font-semibold mb-2">Assignment Management</h4>
            <div className="bg-gray-50 rounded-xl p-4 shadow">
              <p className="text-sm mb-2 font-medium">Recent Assignments</p>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Math Quiz #3</span>
                  <span className="text-blue-600">24/30 submitted</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">Due: Today</div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span>Science Project</span>
                  <span className="text-blue-600">12/30 submitted</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">Due: Next Week</div>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div>
            <h4 className="font-semibold mb-2">Performance Analytics</h4>
            <div className="bg-gray-50 rounded-xl p-4 shadow text-sm">
              <div className="mb-2">
                <p>Assignment Completion</p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full w-[87%]"></div>
                </div>
              </div>
              <div className="mb-2">
                <p>Average Grade</p>
                <div className="text-blue-600 font-bold">B+</div>
              </div>
              <div>
                <p>Student Engagement</p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-purple-500 h-2 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
<section className="py-16 px-4 text-center">
  <h2 className="text-2xl font-semibold mb-2">Why Choose CampusSink?</h2>
  <p className="text-gray-600 mb-10 max-w-xl mx-auto">
    Built with modern technology and educational expertise to deliver exceptional results.
  </p>
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
    {/* Student Workload */}
    <div>
      <div className="text-indigo-600 text-3xl mb-2">📚</div>
      <h4 className="font-semibold">Student Workload</h4>
      <p className="text-sm text-gray-600 mt-1">
        Stay on top of assignments and deadlines effortlessly with streamlined tools designed for student success.
      </p>
    </div>

    {/* Save Time */}
    <div>
      <div className="text-blue-600 text-3xl mb-2">🕒</div>
      <h4 className="font-semibold">Save Time</h4>
      <p className="text-sm text-gray-600 mt-1">
        Automate routine tasks and focus on what matters most - education.
      </p>
    </div>

    {/* Boost Performance */}
    <div>
      <div className="text-green-600 text-3xl mb-2">📈</div>
      <h4 className="font-semibold">Boost Performance</h4>
      <p className="text-sm text-gray-600 mt-1">
        Data-driven insights help improve outcomes and institutional efficiency.
      </p>
    </div>

    {/* Better Communication */}
    <div>
      <div className="text-purple-600 text-3xl mb-2">💬</div>
      <h4 className="font-semibold">Better Communication</h4>
      <p className="text-sm text-gray-600 mt-1">
        Seamless communication between all stakeholders in the education ecosystem.
      </p>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50 text-center" id="reviews">
        <h2 className="text-2xl font-semibold mb-10">Trusted by Educators Worldwide</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <p className="text-yellow-500 text-xl mb-2">★★★★★</p>
            <p className="text-sm mb-4">"CampusSink has transformed how we manage our classroom. The assignment tracking and grading features have saved me hours every week."</p>
            <p className="font-semibold">Sarah Johnson</p>
            <p className="text-xs text-gray-500">High School Teacher</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <p className="text-yellow-500 text-xl mb-2">★★★★★</p>
            <p className="text-sm mb-4">"The analytics dashboard gives us incredible insights into student performance. We can identify and help struggling students much earlier now."</p>
            <p className="font-semibold">Michael Chen</p>
            <p className="text-xs text-gray-500">School Administrator</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <p className="text-yellow-500 text-xl mb-2">★★★★★</p>
            <p className="text-sm mb-4">"As a student, I love being able to track my progress and communicate with teachers easily. Everything is in one place!"</p>
            <p className="font-semibold">Emma Rodriguez</p>
            <p className="text-xs text-gray-500">University Student</p>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-[#0c1327] text-white py-10 px-4 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold mb-2">CampusSink</div>
            <p>Empowering education through innovative technology and seamless management solutions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul>
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Updates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Training</li>
              <li>Resources</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Press</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-10">© 2024 CampusSink. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
