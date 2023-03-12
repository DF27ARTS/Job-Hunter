<head>
  <link href="https://fonts.googleapis.com/css2?family=Merienda&display=swap" rel="stylesheet">
</head>

<main>
  <h1>Jub Hunter</h1>

  <!-- Job hunter gallery -->
  <p> Gallery of the application </p>
  <section>
    <img width="80%" src="./client/src/job_hunter_assets/job-hunter-img-one.png" alt="application image"/>
    <img width="80%" src="./client/src/job_hunter_assets/job-hunter-img-two.png" alt="application image"/>
    <img width="80%" src="./client/src/job_hunter_assets/job-hunter-img-three.png" alt="application image"/>
    <img width="80%" src="./client/src/job_hunter_assets/job-hunter-img-four.png" alt="application image"/>
    <img width="80%" src="./client/src/job_hunter_assets/job-hunter-img-five.png" alt="application image"/>
  </section>

  <p>
    This application helps you manage and keep track of all the job
    applications you submit during your job search process. It
    allows you to easily monitor and organize your job search so you
    can stay on top of all your applications
  </p>

  <p>The application includes the following features:</p>
  <ul>
    <li>Landing page</li>
    <li>Introductory video</li>
    <li>Controled login and registration</li>
    <li>Search engine</li>
    <li>Filters by date and status</li>
    <li>Infinite loading</li>
  </ul>

  </br>

  <p>Application created using</p>
  <ul>
    <li>Typescript</li>
    <li>ReactJS</li>
    <li>Redux/Toolkit</li>
    <li>HTML / SCSS</li>
    <li>Javascript</li>
    <li>NodeJS</li>
    <li>ExpressJS</li>
    <li>SequelizeJS</li>
    <li>PostgreSQL</li>
    <li>Bcript</li>
    <li>JWT</li>
  </ul>

  <p>Application link deployment <a href="https://gallery-front-288a.vercel.app/" >Jub hunter</a> </p>

  <br/>

  <p>Start the application locally by following these steps:</p>

  <ol>
    <li>Open a terminal. If you're using Visual Studio Code, you can do this by pressing  <code>CTRL + Ñ</code> </li>
    <li>Navigate to the server directory by entering the following command in the terminal: <code>cd server.</code> </li>
    <li>Once you're in the server directory, enter the command <code>npm run dev</code> to start the server. </li>
    <li>Open a new terminal to start the client. If you're using Visual Studio Code, click the plus sign <code>(+)</code> at the top-right corner of the terminal.</li>
    <li>Navigate to the client directory by entering the following command in the terminal <code>cd client</code></li>
    <li>To start the client, enter the command <code>npm run dev</code> in the terminal.</li>
    <li>Finally, you should see a link displayed in the terminal that looks like this: <code>http://localhost:5173</code> Click on the link to go to the landing page</li>
    <li> 
      If you encounter any issues, feel free to send me an email at 
      <a href="mailto:diego27fernando72@gmail.com">
        <code>diego27fernando72@gmail.com</code>  
      </a>
    </li>
  </ol>

  <p>
    I hope you enjoy the application
  </p>
  
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2vh;
    padding: 3vh 0;
  }

  h1 {
    font-family: 'Merienda', cursive;
    background: linear-gradient(90deg, rgba(71,139,214,1), rgba(37,216,211,1));
    -webkit-background-clip: text;
    color: transparent;
    
    padding: 0 1vh;
    align-self: center;
  }

  section {
    display: flex;
    gap: .2vh;
    width: 100%;
    height: 50vh;
    left: 0;
    right: 0;
    margin: auto;
  }

  section img {
    height: 100%;
    width: 0;
    flex-grow: 1;
    object-fit: cover;
    border: 1px solid #ccc;

    filter: grayscale(.7)  ;
    transition: 
      width 300ms ease-in-out,
      filter 500ms ease-in-out;
  }

  section img:hover {
    filter: grayscale(0) contrast(1.2) ;
    width: 50%;
  }

  p a {
    text-decoration: none;
    color: red;
    font-weight: bold;
    font-family: 'Merienda', cursive;
    margin: 0 3vh;
    padding: 0 1vh;
    width: fit-content;
    background: linear-gradient(90deg, rgba(71,139,214,1), rgba(37,216,211,1));
    -webkit-background-clip: text;
    color: transparent;

    position: relative;
  }

  p a::before {
    position: absolute;
    content: "";
    top: 100%;
    left: 0;
    right: 2vh;
    margin: auto;
    background: linear-gradient(90deg, rgba(71,139,214,1), rgba(37,216,211,1));
    border-radius: 20vh;

    height: 2px;
    width: 0;
    transition: width 200ms ease-in-out;
  }

  p a:hover {
    background: linear-gradient(90deg, rgba(71,139,214,1), rgba(37,216,211,1));
    -webkit-background-clip: text;
    color: transparent;
  }

  p a:hover::before {
    width: 85%;
  }
  
  code {
    font-weight: 700;
  }
</style>
