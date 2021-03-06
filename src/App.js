import React, { Component } from "react";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  },
  status: "Detect",
  signInStatus: "Sign In",
  registerStatus: "Register"
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocations = data => {
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height
      };
    });
  };

  displayFaceBox = boxes => {
    this.setState({ boxes: boxes });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = async () => {
    try {
      this.setState({ imageUrl: this.state.input, boxes: [], status:'Please wait...' });
      
      // fetch face api to get point position
      const response = await fetch(
        "https://stormy-forest-17045.herokuapp.com/imageurl",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: this.state.input
          })
        }
      );
      const data = await response.json();
      console.log('data::', data)
      if (data === "unable to work with API"){
        alert("wrong format url image (must be .jpg, .png), please choose other link")
        this.setState({status: "Detect"})
        return;
      }
        if (data) {
          // increase number of entries
          const response = await fetch(
            "https://stormy-forest-17045.herokuapp.com/image",
            {
              method: "put",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: this.state.user.id
              })
            }
          );
          const count = await response.json();
          if (count) {
            this.setState(Object.assign(this.state.user, { entries: count }));
          }
          this.displayFaceBox(this.calculateFaceLocations(data));
          this.setState({ status: "Detect" });
        }
    } catch (error) {
      console.log("error image:::", error);
    }
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              status={this.state.status}
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin signInStatus={this.state.signInStatus} loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            registerStatus={this.state.registerStatus}
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
