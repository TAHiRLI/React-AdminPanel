import React from "react";

const GeneralContext = React.createContext();

function GeneralContextProvider({ children }) {
    const [isSidebarActive, setIsSidebarActive] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const [userRole, setUserRole] = React.useState("");

    return (
        <GeneralContext.Provider value={
            {
                isSidebarActive, setIsSidebarActive,
                isAuthenticated, setIsAuthenticated,
                isAuthorized, setIsAuthorized,
                userRole, setUserRole
            }
        } >
            {children}
        </GeneralContext.Provider>
    );
}
const useGeneralContext = () => React.useContext(GeneralContext);
export { useGeneralContext, GeneralContextProvider };