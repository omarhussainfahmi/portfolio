import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { ExternalLink } from '../components/ui';
export default function SiteInformation({ terms = false }: { terms?: boolean }) {
  return (
    <article className="policy-page">
      <nav aria-label="Portfolio navigation">
        <Link className="text-link" to="/">
          <ArrowLeft size={17} aria-hidden="true" /> Back to portfolio
        </Link>
      </nav>

      <h1>{terms ? 'Website terms' : 'Privacy & cookies'}</h1>
      <p className="policy-updated">Updated 18 October 2026</p>
      {terms ? (
        <>
          <p>
            This personal portfolio presents the work, skills, and learning of {siteConfig.name}. It
            is provided for professional introductions and information.
          </p>
          <h2>Projects and materials</h2>
          <p>
            Project descriptions distinguish completed work, learning samples, conceptual visuals,
            and proposed improvements. Examples do not constitute an offer of a paid service or a
            guarantee of future results.
          </p>
          <p>
            Code repositories have their own licenses. Project contributions, third-party logos,
            certificates, and linked materials remain subject to their respective owners' rights.
            Please ask before reusing portfolio text or images beyond ordinary viewing and sharing
            links.
          </p>
          <h2>External resources and availability</h2>
          <p>
            External services control their own content, access, and availability. Information may
            be updated, and some older demonstrations may be unavailable. Contact Omar if a link
            fails or you need clarification about a project.
          </p>
          <h2>Professional enquiries</h2>
          <p>
            Any project scope, payment, confidentiality, or other working arrangement must be agreed
            separately. Sending an enquiry does not create a service agreement.
          </p>
        </>
      ) : (
        <>
          <p>
            This notice explains how this portfolio uses browser storage, external services, and
            information you choose to send to {siteConfig.name}.
          </p>
          <h2>Contacting me</h2>
          <p>
            The email and phone links open your own mail or calling application. This website has no
            contact submission form, visitor account, payment system, or mailing list. If you email
            me, I use the information you provide to respond and discuss your enquiry. Please avoid
            sending sensitive documents in an initial message.
          </p>
          <h2>Browser storage and cookies</h2>
          <p>
            The portfolio remembers your theme and recruiter-mode choices in local storage. It also
            caches public GitHub results for a short period to reduce repeated requests. These
            values stay in your browser; clearing this site's data in your browser settings removes
            them. The portfolio does not set advertising cookies or use advertising pixels.
          </p>
          <h2>Visitor analytics and hosting</h2>
          <p>
            Cloudflare Pages hosts the site and processes technical request information to deliver
            and protect it. Cloudflare Web Analytics measures page visits and loading performance
            without analytics cookies or cross-site visitor profiles. Analytics can be blocked by
            browser privacy tools, so counts may be incomplete.
          </p>
          <nav aria-label="Cloudflare privacy reference">
            <ExternalLink className="text-link" href="https://www.cloudflare.com/privacypolicy/">
              Cloudflare privacy information
            </ExternalLink>
          </nav>
          <h2>GitHub and optional LinkedIn videos</h2>
          <p>
            The homepage requests public repository information from GitHub. GitHub receives the
            technical information needed for that request. LinkedIn's embedded player is loaded only
            after you choose the video button. Loading it connects your browser to LinkedIn, which
            may use cookies and process information under its own policy. You can browse the
            portfolio without loading that player.
          </p>
          <nav className="policy-related" aria-label="Related privacy information">
            <ExternalLink
              className="text-link"
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            >
              GitHub privacy information
            </ExternalLink>
            <ExternalLink
              className="text-link"
              href="https://www.linkedin.com/legal/privacy-policy"
            >
              LinkedIn privacy information
            </ExternalLink>
          </nav>
          <h2>Your choices and questions</h2>
          <p>
            You can clear local site data, block analytics using browser tools, and leave videos
            unloaded. For questions about information you sent directly, contact me using the email
            below. I retain correspondence only as needed for the enquiry, an ongoing professional
            relationship, or applicable obligations.
          </p>
        </>
      )}
      <h2>Contact</h2>
      <a className="text-link" href={`mailto:${siteConfig.email}`}>
        {siteConfig.email}
      </a>
      <div className="policy-related">
        <Link to={terms ? '/privacy' : '/terms'}>
          {terms ? 'Privacy & cookies' : 'Website terms'} <span aria-hidden="true">/</span>
        </Link>
      </div>
    </article>
  );
}
