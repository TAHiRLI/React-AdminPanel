import React from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LoginService } from '../../APIs/Services/LoginService';
import '../Login/main.scss';
import "../Login/util.scss";
import "material-design-iconic-font/dist/css/material-design-iconic-font.min.css";
import { ROUTES } from '../../Consts/Routes';

function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSucceed, setIsSucceed] = React.useState(false);



    const onSubmit = data => {
        console.log(data);
        LoginService.SubmitLogin(data).then(res => {
            console.log(res.status);
            if (res.status == 200) {
                sessionStorage.setItem("token", JSON.stringify(res.data.token));
                setIsSucceed(true);
            }

        })
            .catch(err => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Username or password is incorrect',
                    icon: 'error',
                });
            });
    };
    if(isSucceed){
        return (
            <Redirect to={ROUTES.DASHBOARD.MAIN_PATH}/>
        )
    }

  
        return (
            <div className="limiter">
                <div className="container-login100" id='bg-image' >
                    <div className="wrap-login100">
                        <form className="login100-form validate-form" onSubmit={handleSubmit(onSubmit)}>
                            <span className="login100-form-logo">
                                <i className="zmdi zmdi-landscape"></i>
                            </span>

                            <span className="login100-form-title p-b-34 p-t-27">
                                Log in
                            </span>

                            <div className="wrap-input100 validate-input" data-validate="Enter username">
                              <input
                                    id="username"
                                    className="input100 login"
                                    type="text"
                                    placeholder="Username"
                                    aria-invalid={errors.username ? "true" : "false"}
                                    {...register("username", { required: "this field is required", maxLength: 20 })}
                                />
                                {errors.username && errors.username.type === "required" && <small classNameName='text-danger' role="alert">{errors?.username?.message}</small>}
                                {errors.username && errors.username.type === "maxLength" && <small classNameName='text-danger' role="alert">Max length must be 20 characters</small>}

                                <span className="focus-input100" data-placeholder="&#xf207;"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <input className="input100 login"
                                    id="password"
                                    type="password"
                                    placeholder='password'
                                    aria-invalid={errors.password ? "true" : "false"}
                                    {...register("password", { required: "this field is required", minLength: 5 })} />
                                <span className="focus-input100" data-placeholder="&#xf191;"></span>
                            </div>
                            {errors.password && errors.password.type === "required" && <small classNameName='text-danger' role="alert">{errors?.password?.message}</small>}
                             {errors.password && errors.password.type === "minLength" && <small classNameName='text-danger' role="alert">Min length Must Be 5 characters</small>}



                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn login"
                                type="submit"  >
                                    Login
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    

    
}



export default Login;