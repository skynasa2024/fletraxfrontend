import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router';
import './styles.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="w-full">
      <nav className="bg-coal-600 p-4 flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <img
            src={toAbsoluteUrl('/media/app/default-logo-dark.svg')}
            className="max-h-[25px] w-full"
            alt="mini-logo"
          />
        </Link>
      </nav>
      <div className="py-10 container mx-auto">
        <h1>Fletrax Privacy Policy</h1>
        <p>
          This Privacy Policy describes Our policies and procedures on the collection, use, and
          disclosure of Your information when You use the Service and tells You about Your privacy
          rights and how the law protects You.
        </p>
        <p>
          We use Your Personal data to provide and improve the Service. By using the Service, You
          agree to the collection and use of information in accordance with this Privacy Policy.
        </p>

        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the
          following conditions. The following definitions shall have the same meaning regardless of
          whether they appear in singular or in plural.
        </p>

        <h3>Definitions</h3>
        <ul>
          <li>
            <strong>Account:</strong> A unique account created for You to access our Service or
            parts of our Service.
          </li>
          <li>
            <strong>Affiliate:</strong> An entity that controls, is controlled by or is under common
            control with a party, where "control" means ownership of 50% or more of the shares,
            equity interest, or other securities entitled to vote for election of directors or other
            managing authority.
          </li>
          <li>
            <strong>Application:</strong> The software program provided by the Company downloaded by
            You on any electronic device, named Fletrax.
          </li>
          <li>
            <strong>Company:</strong> (referred to as either "the Company", "We", "Us" or "Our" in
            this Agreement) refers to Fletrax.
          </li>
          <li>
            <strong>Country:</strong> Refers to: Turkey.
          </li>
          <li>
            <strong>Device:</strong> Any device that can access the Service such as a computer, a
            cellphone, or a digital tablet.
          </li>
          <li>
            <strong>Personal Data:</strong> Any information that relates to an identified or
            identifiable individual.
          </li>
          <li>
            <strong>Service:</strong> Refers to the Application.
          </li>
          <li>
            <strong>Service Provider:</strong> Any natural or legal person who processes the data on
            behalf of the Company. It refers to third-party companies or individuals employed by the
            Company to facilitate the Service, to provide the Service on behalf of the Company, to
            perform services related to the Service, or to assist the Company in analyzing how the
            Service is used.
          </li>
          <li>
            <strong>Usage Data:</strong> Data collected automatically, either generated by the use
            of the Service or from the Service infrastructure itself (for example, the duration of a
            page visit).
          </li>
          <li>
            <strong>You:</strong> The individual accessing or using the Service, or the company, or
            other legal entity on behalf of which such individual is accessing or using the Service,
            as applicable.
          </li>
        </ul>

        <h2>Collecting and Using Your Personal Data</h2>
        <h3>Types of Data Collected</h3>
        <h4>Personal Data</h4>
        <p>
          While using Our Service, We may ask You to provide Us with certain personally identifiable
          information that can be used to contact or identify You. Personally identifiable
          information may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Usage Data</li>
        </ul>

        <h4>Usage Data</h4>
        <p>Usage Data is collected automatically when using the Service.</p>
        <p>
          Usage Data may include information such as Your Device's Internet Protocol address (e.g.,
          IP address), browser type, browser version, the pages of our Service that You visit, the
          time and date of Your visit, the time spent on those pages, unique device identifiers and
          other diagnostic data.
        </p>

        <p>
          When You access the Service by or through a mobile device, We may collect certain
          information automatically, including, but not limited to, the type of mobile device You
          use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile
          operating system, the type of mobile Internet browser You use, unique device identifiers
          and other diagnostic data.
        </p>
        <p>
          We may also collect information that Your browser sends whenever You visit our Service or
          when You access the Service by or through a mobile device.
        </p>

        <h4>Information Collected while Using the Application</h4>
        <p>
          While using Our Application, in order to provide features of Our Application, We may
          collect, with Your prior permission:
        </p>
        <ul>
          <li>Information regarding your location</li>
        </ul>
        <p>
          We use this information to provide features of Our Service, to improve and customize Our
          Service. The information may be uploaded to the Company's servers and/or a Service
          Provider's server or it may be simply stored on Your device.
        </p>
        <p>
          You can enable or disable access to this information at any time through Your Device
          settings.
        </p>

        <h3>Use of Your Personal Data</h3>
        <p>The Company may use Personal Data for the following purposes:</p>
        <ul>
          <li>
            To provide and maintain our Service, including to monitor the usage of our Service.
          </li>
          <li>
            To manage Your Account: to manage Your registration as a user of the Service. The
            Personal Data You provide can give You access to different functionalities of the
            Service that are available to You as a registered user.
          </li>
          <li>
            For the performance of a contract: the development, compliance, and undertaking of the
            purchase contract for the products, items, or services You have purchased or of any
            other contract with Us through the Service.
          </li>
          <li>
            To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms
            of electronic communication, such as a mobile application's push notifications regarding
            updates or informative communications related to the functionalities, products, or
            contracted services, including the security updates, when necessary or reasonable for
            their implementation.
          </li>
          <li>
            To provide You with news, special offers, and general information about other goods,
            services, and events which we offer that are similar to those that you have already
            purchased or enquired about unless You have opted not to receive such information.
          </li>
          <li>To manage Your requests: To attend and manage Your requests to Us.</li>
          <li>
            For business transfers: We may use Your information to evaluate or conduct a merger,
            divestiture, restructuring, reorganization, dissolution, or other sale or transfer of
            some or all of Our assets, whether as a going concern or as part of bankruptcy,
            liquidation, or similar proceeding, in which Personal Data held by Us about our Service
            users is among the assets transferred.
          </li>
          <li>
            For other purposes: We may use Your information for other purposes, such as data
            analysis, identifying usage trends, determining the effectiveness of our promotional
            campaigns, and to evaluate and improve our Service, products, services, marketing, and
            your experience.
          </li>
        </ul>

        <h3>Retention of Your Personal Data</h3>
        <p>
          The Company will retain Your Personal Data only for as long as is necessary for the
          purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the
          extent necessary to comply with our legal obligations (for example, if we are required to
          retain your data to comply with applicable laws), resolve disputes, and enforce our legal
          agreements and policies.
        </p>
        <p>
          The Company will also retain Usage Data for internal analysis purposes. Usage Data is
          generally retained for a shorter period of time, except when this data is used to
          strengthen the security or to improve the functionality of Our Service, or We are legally
          obligated to retain this data for longer time periods.
        </p>

        <h3>Transfer of Your Personal Data</h3>
        <p>
          Your information, including Personal Data, is processed at the Company's operating offices
          and in any other places where the parties involved in the processing are located. It means
          that this information may be transferred to — and maintained on — computers located
          outside of Your state, province, country, or other governmental jurisdiction where the
          data protection laws may differ from those from Your jurisdiction.
        </p>
        <p>
          Your consent to this Privacy Policy followed by Your submission of such information
          represents Your agreement to that transfer.
        </p>
        <p>
          The Company will take all steps reasonably necessary to ensure that Your data is treated
          securely and in accordance with this Privacy Policy and no transfer of Your Personal Data
          will take place to an organization or a country unless there are adequate controls in
          place including the security of Your data and other personal information.
        </p>

        <h3>Disclosure of Your Personal Data</h3>
        <h4>Business Transactions</h4>
        <p>
          If the Company is involved in a merger, acquisition, or asset sale, Your Personal Data may
          be transferred. We will provide notice before Your Personal Data is transferred and
          becomes subject to a different Privacy Policy.
        </p>

        <h4>Law enforcement</h4>
        <p>
          Under certain circumstances, the Company may be required to disclose Your Personal Data if
          required to do so by law or in response to valid requests by public authorities (e.g., a
          court or a government agency).
        </p>

        <h4>Other legal requirements</h4>
        <p>
          The Company may disclose Your Personal Data in the good faith belief that such action is
          necessary to:
        </p>
        <ul>
          <li>Comply with a legal obligation</li>
          <li>Protect and defend the rights or property of the Company</li>
          <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
          <li>Protect the personal safety of Users of the Service or the public</li>
          <li>Protect against legal liability</li>
        </ul>

        <h3>Security of Your Personal Data</h3>
        <p>
          The security of Your Personal Data is important to Us, but remember that no method of
          transmission over the Internet, or method of electronic storage is 100% secure. While We
          strive to use commercially acceptable means to protect Your Personal Data, We cannot
          guarantee its absolute security.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our Service does not address anyone under the age of 13. We do not knowingly collect
          personally identifiable information from anyone under the age of 13. If You are a parent
          or guardian and You are aware that Your child has provided Us with Personal Data, please
          contact Us. If We become aware that We have collected Personal Data from anyone under the
          age of 13 without verification of parental consent, We take steps to remove that
          information from Our servers.
        </p>
        <p>
          If We need to rely on consent as a legal basis for processing Your information and Your
          country requires consent from a parent, We may require Your parent's consent before We
          collect and use that information.
        </p>

        <h2>Links to Other Websites</h2>
        <p>
          Our Service may contain links to other websites that are not operated by Us. If You click
          on a third-party link, You will be directed to that third party's site. We strongly advise
          You to review the Privacy Policy of every site You visit.
        </p>
        <p>
          We have no control over and assume no responsibility for the content, privacy policies, or
          practices of any third-party sites or services.
        </p>

        <h2>Changes to this Privacy Policy</h2>
        <p>
          We may update Our Privacy Policy from time to time. We will notify You of any changes by
          posting the new Privacy Policy on this page.
        </p>
        <p>
          We will let You know via email and/or a prominent notice on Our Service, prior to the
          change becoming effective and update the "Last updated" date at the top of this Privacy
          Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any changes. Changes to
          this Privacy Policy are effective when they are posted on this page.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, You can contact us:</p>
        <ul>
          <li>
            By email: <a href="mailto:skynasa2024@gmail.com">skynasa2024@gmail.com</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
