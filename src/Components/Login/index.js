import React from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
import { LoginService } from '../../APIs/Services/LoginService';

function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSucceed, setIsSucceed] = React.useState(false);
    


    const onSubmit = data => {
        console.log(data);
        LoginService.SubmitLogin(data).then(res=>{
            console.log(res.status)
            if(res.status == 200){
                sessionStorage.setItem("token", JSON.stringify(res.data.token) )
                setIsSucceed(true);
                
            }
        })
    };
    
         return (
     
        <div className='col-md-6 m-auto'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor='username' className="form-label">UserName</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        placeholder='UserName'
                        aria-invalid={errors.username ? "true" : "false"}
                        {...register("username", { required: "this field is required" , maxLength:20 })}
                    />
                    {errors.username && errors.username.type === "required" && <small className='text-danger' role="alert">{errors?.username?.message}</small>}
                    {errors.username && errors.username.type === "maxLength" && <small className='text-danger' role="alert">Max length must be 20 characters</small>}

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder='password'
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", { required: "this field is required", minLength:5 })}
                    />
                    {errors.password && errors.password.type === "required" && <small className='text-danger' role="alert">{errors?.password?.message}</small>}
                    {errors.password && errors.password.type === "minLength" && <small className='text-danger' role="alert">Min length Must Be 5 characters</small>}


                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
            {isSucceed? (<Redirect to={"/jwt"}/>):(<></>)}
        </div>
    );
    }
   


export default Login;