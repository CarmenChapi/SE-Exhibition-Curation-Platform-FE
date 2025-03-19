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

  return (
    <div className="share-container">
      <h3>Share this artwork</h3>
      
      <div className="share-buttons">
        <FacebookShareButton url={shareUrl} quote={title} aria-label="Share on Facebook">
          <FacebookIcon size={40} round />
          <span className="sr-only">Share on Facebook</span>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title} aria-label="Share on Twitter">
          <TwitterIcon size={40} round />
          <span className="sr-only">Share on Twitter</span>
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={title} aria-label="Share on WhatsApp">
          <WhatsappIcon size={40} round />
          <span className="sr-only">Share on WhatsApp</span>
        </WhatsappShareButton>

        <LinkedinShareButton url={shareUrl} title={title} aria-label="Share on LinkedIn">
          <LinkedinIcon size={40} round />
          <span className="sr-only">Share on LinkedIn</span>
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default ShareArtwork;
