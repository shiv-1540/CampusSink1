import React from 'react';

function ProfilePicture({ name, backgroundColor, size = 40 }) {
  const initials = getInitials(name);


  function getInitials(fullName) {
  if (!fullName) return "";

  const nameParts = fullName.split(" ");
  let initials = "";

  for (let i = 0; i < nameParts.length; i++) {
    if (nameParts[i].length > 0 && nameParts[i] !== '') {
      initials += nameParts[i][0].toUpperCase();
    }
  }

  return initials;
}

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: backgroundColor || '#007bff', // Default blue
    color: '#fff',
    fontSize: `${size * 0.6}px`, // Adjust font size based on size
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  };

  return (
    <div style={style}>
      {initials}
    </div>
  );
}

export default ProfilePicture;