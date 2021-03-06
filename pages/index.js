import styles from "../styles/Home.module.scss";
import Layout from "../components/Layout";
import React from "react";
import AddCount from "../components/AddCount";

const Home = () => {
    return (
        <Layout title="Number Charts | Home">
            <div className={styles.container}>
                <main className={styles.main}>
                    <p>Index</p>
                    <AddCount />
                </main>
            </div>
        </Layout>
    );
};

export default Home;
