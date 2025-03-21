import { createContext, useState } from "react";

export const UserContext = createContext();
// const loggedInUser = {
//   displayName:'Ann Barker',
//   email: 'mariachaparro58@mail.com',
//   photoURL: 'https://images.unsplash.com/photo-1501644898242-cfea317d7faf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXJ0JTIwZnJlZXxlbnwwfHwwfHx8MA%3D%3D'
// }
export const UserProvider = ({ children }) => {
  const [userCx, setUserCx] = useState(null);//loggedInUser);

  return (
    <UserContext.Provider value={{ userCx, setUserCx }}>
      {children}
    </UserContext.Provider>
  );
};
