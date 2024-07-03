'use client'

import Script from 'next/script'

export default function LinkedinFrame({ user }: { user: string }) {
  // return iframe with linkedin profile
  return (
    <div className="w-full grid max-w-2xl p-8">
      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        async
        defer
        type="text/javascript"
      ></Script>

      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="medium"
        data-theme="light"
        data-type="VERTICAL"
        data-vanity="mohdkaif00"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href="https://in.linkedin.com/in/mohdkaif00?trk=profile-badge"
        >
          Mohd Kaif
        </a>
      </div>

      <div>
        <p>
          <a href={`https://www.linkedin.com/in/mohdkaif00`}>
            View LinkedIn Profile
          </a>
        </p>
      </div>
    </div>
  )
}
