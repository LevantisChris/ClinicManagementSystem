import React, {useContext} from 'react';
import GlobalContext from "../../context/GlobalContext";

const SuccessApp = () => {

    const {
        successMessage,
        setSuccessMessage,
    } = useContext(GlobalContext);

    const handleClick = () => {
        console.log('Button Success clicked!');
        setSuccessMessage(null)
    };

    return (
        <div style={styles.container}>
      <span className="material-icons" style={styles.icon}>
        check_circle
      </span>
            <div style={styles.message}>{successMessage}</div>
            <button style={styles.button} onClick={handleClick}>
                Ok
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    icon: {
        color: '#12ff00',
        fontSize: '80px',
    },
    message: {
        marginTop: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#bfbfbf',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#12ff00',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default SuccessApp;
