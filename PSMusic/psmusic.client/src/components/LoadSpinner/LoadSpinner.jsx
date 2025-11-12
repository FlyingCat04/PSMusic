import { ClipLoader } from "react-spinners";
import './LoadSpinner.css';

function LoadSpinner({ color = "#c4a2dc", size = 80 }) {
    return (
        <div className="spinner-overlay">
            <ClipLoader color={color} size={size} />
        </div>
    );
}

export default LoadSpinner;