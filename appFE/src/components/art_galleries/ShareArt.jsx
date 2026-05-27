import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

const ShareArtwork = ({ title, url }) => {
  const shareUrl = url || window.location.href;
  const shareTitle =  "Check out this artwork! "+ (title || "Unknown Title");

  return (
    <div className="share-container">
      <h3>Art deserves to be shared 🎨</h3>
      
      <div className="share-buttons">
        <FacebookShareButton url={shareUrl} quote={shareTitle} aria-label="Share on Facebook">
          <FacebookIcon size={50} round />
          <span className="sr-only">on Facebook</span>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={shareTitle} aria-label="Share on Twitter">
          <TwitterIcon size={50} round />
          <span className="sr-only">on Twitter</span>
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={shareTitle} aria-label="Share on WhatsApp">
          <WhatsappIcon size={50} round />
          <span className="sr-only">on WhatsApp</span>
        </WhatsappShareButton>

        <LinkedinShareButton url={shareUrl} title={shareTitle} aria-label="Share on LinkedIn">
          <LinkedinIcon size={50} round />
          <span className="sr-only">on LinkedIn</span>
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default ShareArtwork;
