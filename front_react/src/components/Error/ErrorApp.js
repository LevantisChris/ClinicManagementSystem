import React, {useContext} from 'react';
import GlobalContext from "../../context/GlobalContext";

const ErrorApp = () => {

    const {
        errorMessage,
        setErrorMessage
    } = useContext(GlobalContext);

    const handleClick = () => {
        console.log('Button Error clicked!');
        setErrorMessage(null)
    };

    return (
        <div style={styles.container}>
      <span className="material-icons" style={styles.icon}>
        error
      </span>
            <div style={styles.message}>{errorMessage}</div>
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
        color: '#da0000',
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
        backgroundColor: '#da0000',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ErrorApp;
