import React from "react";

type ProfileProps = {
  email: string;
  logout: () => void;
};

const Profile: React.FC<ProfileProps> = ({ email, logout }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Hi, {email}</h2>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white p-2 rounded w-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
