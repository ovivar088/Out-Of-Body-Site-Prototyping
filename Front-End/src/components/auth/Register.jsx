import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../features/authSlice";
import { StyledForm } from "./Styledform";

const Register = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    
    console.log(auth);

    useEffect(() => {
        if(auth._id){ //if the person is logged in take person to cart
            navigate("/cart")
        }
    }, [auth._id, navigate]); //dependencies

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    }) //we want to update this state down there vvv --- onchange event
    
    //console.log("user: ",user)

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(registerUser(user)) //now when we submit the form we are dispatching the backend function registerUser , save database, add token
    };

    return ( 
    <>
    <StyledForm onSubmit = {handleSubmit}>
        <h2>Register</h2>
        <input
            type="text" 
            placeholder="name" 
            onChange = {(e) => setUser({...user, name: e.target.value})} //this is how we are updating the name
        />
        <input 
            type="email" 
            placeholder="email" 
            onChange = {(e) => setUser({...user, email: e.target.value})}
        /> 
        <input 
            type="password" 
            placeholder="password" 
            onChange = {(e) => setUser({...user, password: e.target.value})}
        />
        <button>Register</button>
        <p>{auth.registerUser === "rejected" ? (
            <p>{auth.registerError}</p>
        ) : null}</p>
    </StyledForm>
    </>
    );
};
export default Register;