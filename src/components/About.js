import "./about.css"
const About = () =>{
    return(
        <>
        <section className="about" id="about">
        <div className="max-width">
            <h2 className="title">About me</h2>
            <div className="about-content">
                <div className="column left">
                <img src={require("../images/mypic.png")} alt="Logo" />
                    </div>
                <div className="column right">
                    <div className="text">I'm venkata sailesh and I'm a <span class="typing-2"></span></div>
                    <h4>recent graduate from Sri Venkateswara Engineering College, 
                        where I earned my degree in Computer Science and Engineering. 
                        Currently, I am working as an Apprentice Software Engineer, 
                        gaining hands-on experience in software engineering and specializing in React. 
                        Throughout my academic and professional journey,
                         I have built a strong foundation in software development and engineering principles, 
                         equipping me with a diverse set of technical skills.</h4>

                </div>
            </div>
        </div>
    </section>
        
    </>
    );
}

export default About;