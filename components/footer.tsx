"use client";
import { FaQuestionCircle } from 'react-icons/fa'; // Import the help icon

export default function Footer() {
  const redirectToTutorial = () => {
    window.open("https://youtu.be/302C0nnoIlA", "_blank");
  };

  return (
    <footer className="bg-body-tertiary text-center text-lg-start fixed-bottom">
      <div className="text-center p-3">
        <span>© 2024 Copyright: Pyszkomat sp. z.o.o</span>
        {/* Add the help icon and the onClick event */}
        <FaQuestionCircle
          size={24} // Set the icon size
          onClick={redirectToTutorial} // Trigger redirect on click
          style={{ cursor: 'pointer', marginLeft: '15px', color: '#007bff' }} // Add some styling
        />
      </div>
    </footer>
  );
}
