import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faFacebook,
    faTwitter,
    faInstagram
  } from "@fortawesome/free-brands-svg-icons";
  

export default function SocialFollow() {
    return (
      <div className="container social-container">
        <div className='row text-center'>
            <p>Follow on</p>
        </div>
        <div className='row d-flex  justify-content-evenly'>
            <a href="https://www.youtube.com/"
                className="col youtube social">
                <FontAwesomeIcon icon={faYoutube} size="2x"/>
            </a>
            <a href="https://www.facebook.com/"
                className="col facebook social">
                <FontAwesomeIcon icon={faFacebook} size="2x" className="cupra-petrol"/>
            </a>
            <a href="https://www.twitter.com/"
                className="col twitter social">
                <FontAwesomeIcon icon={faTwitter} size="2x" className="cupra-petrol"/>
            </a>
            <a href="https://www.instagram.com/"
                className="col instagram social">
                <FontAwesomeIcon icon={faInstagram} size="2x" className="cupra-petrol" />
            </a>
        </div>
      </div>
    );
  }
