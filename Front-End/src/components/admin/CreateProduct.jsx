import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton } from "./CommonStyled";
import { productsCreate } from "../../features/productsSlice";



const CreateProduct = () => {
    const dispatch = useDispatch();//hook, it seems to call upon a function
    const { createStatus } = useSelector((state) => state.products);

    //When creating a product our initial states are empty
    const [productImg, setProductImg] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");

    console.log(productImg);
    
    //Uploads image
    const handleProductImageUpload = (e) => {
        const file = e.target.files[0];
        TransformFile(file);
    };
    //Transforms an uploaded file 
    const TransformFile = (file) => {
        const reader = new FileReader();

        if(file){
            reader.readAsDataURL(file);
            reader.onloadend = () => { //event will be fired after reading file
                setProductImg(reader.result); 
            };
        }
        else {
            setProductImg("");
        }
    };
    //Submits an Image
    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent a reload on page?
        dispatch(productsCreate({
            name,
            price,
            desc,
            image: productImg
        }));
    };

    //Form that takes in all input fields.
    return ( 
    <StyledCreateProduct>
        <StyledForm onSubmit={handleSubmit}>
            <h3>Create a Product</h3>
            <input type="file" accept = "image/" onChange={handleProductImageUpload} required/>
            {/*<select onChange ={(e) => setName(e.target.value)}>
                <option value ="">Select Name</option>
                <option value ="iphone">iPhone</option>
                <option value ="Samsung">Samsung</option>
                <option value ="Google">Google</option>
                <option value ="other">Other</option>
            </select>*//*COOL CODE --> It allows you to make a select box, in this case you could select a brand of the given options*/} 
            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required/>
            <input type="text" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required/>
            <input type="text" placeholder="Description" onChange={(e) => setDesc(e.target.value)} required/>
            <PrimaryButton type = "submit">{createStatus === "pending" ? "Submitting" : "Submit"}</PrimaryButton>
        </StyledForm>
        <ImagePreview>
            {productImg ?
            <>
                <img src = {productImg} alt = "productimage"></img>
            </>
                 : (<p>Image preview</p>)
            }
        </ImagePreview>
    </StyledCreateProduct> 
    );
};
 
export default CreateProduct;

//Styling for Product

const StyledCreateProduct = styled.div`
    display: flex;
    justify-content: space-between;
`;
//Styling for Form
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin-top: 2rem;
    select,
    input{
        padding: 7px;
        min-height: 30px;
        outline: none;
        border-radius: 5px;
        border: 3px solid rgb(182,182,182);
    }
`;

const ImagePreview = styled.div`
    margin: 2rem 0 2rem 2rem;
    padding: 2rem;
    border: 1px solid rgb(183,183,183);
    max-width: 300px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: rgb(78,78,78);
    img{
        max-width:100%;
    }
`;