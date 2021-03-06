import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { vestResolver } from "@hookform/resolvers/vest";
import vest, { test, enforce } from "vest";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { register } from "../store/auth/action";
import { auth } from "../utils/auth/auth-service";
import { useRouter } from "next/router";

import styles from "../styles/Login.module.scss";

const RegisterForm = ({ register }) => {
    const router = useRouter();

    enforce.extend({
        isEmail: (value) => true,
    });
    const schema = vest.create((data = {}) => {
        test("email", "Email is required", () => {
            enforce(data.email).isNotEmpty();
        });

        test("email", "Must be a valid email address", () => {
            enforce(data.email).isEmail();
        });

        test("password", "Password is required", () => {
            enforce(data.password).isNotEmpty();
        });
        test("password", "Password must be at least 6 chars long", () => {
            enforce(data.password).longerThanOrEquals(6);
        });
        test("username", "Username is required", () => {
            enforce(data.username).isNotEmpty();
        });

        test("username", "Username is too short", () => {
            enforce(data.username).longerThanOrEquals(3);
        });
        if (data.password) {
            test("confirmPassword", "Passwords do not match", () => {
                enforce(data.confirmPassword).equals(data.password);
            });
        }
        test("confirmPassword", "Confirm password is required", () => {
            enforce(data.confirmPassword).isNotEmpty();
        });
    });

    const {
        register: registerr,
        errors,
        formState: { touched },
        handleSubmit,
    } = useForm({
        criteriaMode: "all",
        resolver: vestResolver(schema),
    });

    const onSubmit = (data) => {
        register(data.email, data.password)
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.form}
        >
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    ref={registerr}
                    isInvalid={touched.username && errors.username}
                />
                <ErrorMessage
                    errors={errors}
                    name="username"
                    render={({ message }) => (
                        <small className={styles.error}>{message}</small>
                    )}
                />
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    ref={registerr}
                    isInvalid={touched.email && errors.email}
                />
                <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                        <small className={styles.error}>{message}</small>
                    )}
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    ref={registerr}
                    isInvalid={touched.password && errors.password}
                />
                <ErrorMessage
                    errors={errors}
                    name="password"
                    render={({ message }) => (
                        <small className={styles.error}>{message}</small>
                    )}
                />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    ref={registerr}
                    isInvalid={
                        touched.confirmPassword && errors.confirmPassword
                    }
                />
                <ErrorMessage
                    errors={errors}
                    name="confirmPassword"
                    render={({ message }) => (
                        <small className={styles.error}>{message}</small>
                    )}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        register: bindActionCreators(register, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(RegisterForm);
