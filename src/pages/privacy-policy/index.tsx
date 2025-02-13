import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import './styles.css';
import { Helmet } from 'react-helmet-async';

interface PrivacyPolicyPageProps {
  productName?: string;
}

const PrivacyPolicyPage = ({ productName = 'Fletrax' }: PrivacyPolicyPageProps) => {
  const intl = useIntl();
  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(
            { id: 'PRIVACY_POLICY.TITLE' },
            {
              productName
            }
          )}
        </title>
      </Helmet>
      <div className="w-full privacy-policy">
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
          <h1>
            <FormattedMessage id="PRIVACY_POLICY.TITLE" values={{ productName }} />
          </h1>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.DESCRIPTION_2" />
          </p>

          <h2>
            <FormattedMessage id="PRIVACY_POLICY.INTERPRETATION_AND_DEFINITIONS" />
          </h2>
          <h3>
            <FormattedMessage id="PRIVACY_POLICY.INTERPRETATION" />
          </h3>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.INTERPRETATION_DESCRIPTION" />
          </p>

          <h3>
            <FormattedMessage id="PRIVACY_POLICY.DEFINITIONS" />
          </h3>
          <ul>
            {[
              'ACCOUNT',
              'AFFILIATE',
              'APPLICATION',
              'COMPANY',
              'COUNTRY',
              'DEVICE',
              'PERSONAL_DATA',
              'SERVICE',
              'SERVICE_PROVIDER',
              'USAGE_DATA',
              'YOU'
            ].map((term) => (
              <li key={term}>
                <strong>
                  <FormattedMessage id={`PRIVACY_POLICY.DEFINITION.${term}.TITLE`} />
                </strong>
                <FormattedMessage
                  id={`PRIVACY_POLICY.DEFINITION.${term}.TEXT`}
                  values={{ productName }}
                />
              </li>
            ))}
          </ul>

          <h2>
            <FormattedMessage id="PRIVACY_POLICY.COLLECTING_AND_USING_YOUR_PERSONAL_DATA" />
          </h2>
          <h3>
            <FormattedMessage id="PRIVACY_POLICY.TYPES_OF_DATA_COLLECTED" />
          </h3>
          <h4>
            <FormattedMessage id="PRIVACY_POLICY.PERSONAL_DATA" />
          </h4>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.PERSONAL_DATA_DESCRIPTION" />
          </p>
          <ul>
            {['EMAIL_ADDRESS', 'FIRST_NAME_LAST_NAME', 'PHONE_NUMBER', 'USAGE_DATA'].map(
              (dataType) => (
                <li key={dataType}>
                  <FormattedMessage id={`PRIVACY_POLICY.${dataType}`} />
                </li>
              )
            )}
          </ul>

          <h4>
            <FormattedMessage id="PRIVACY_POLICY.USAGE_DATA" />
          </h4>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.USAGE_DATA_DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.USAGE_DATA_DESCRIPTION_2" />
          </p>

          <p>
            <FormattedMessage id="PRIVACY_POLICY.USAGE_DATA_DESCRIPTION_3" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.USAGE_DATA_DESCRIPTION_4" />
          </p>

          <h4>
            <FormattedMessage id="PRIVACY_POLICY.INFORMATION_COLLECTED_WHILE_USING_APPLICATION" />
          </h4>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.INFORMATION_COLLECTED_WHILE_USING_APPLICATION_DESCRIPTION" />
          </p>
          <ul>
            <li>
              <FormattedMessage id="PRIVACY_POLICY.INFORMATION_REGARDING_YOUR_LOCATION" />
            </li>
          </ul>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.INFORMATION_COLLECTED_WHILE_USING_APPLICATION_DESCRIPTION_2" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.INFORMATION_COLLECTED_WHILE_USING_APPLICATION_DESCRIPTION_3" />
          </p>

          <h3>
            <FormattedMessage id="PRIVACY_POLICY.USE_OF_YOUR_PERSONAL_DATA" />
          </h3>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION" />
          </p>
          <ul>
            {[
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_1',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_2',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_3',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_4',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_5',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_6',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_7',
              'USE_OF_YOUR_PERSONAL_DATA_DESCRIPTION_8'
            ].map((descId) => (
              <li key={descId}>
                <FormattedMessage id={`PRIVACY_POLICY.${descId}`} />
              </li>
            ))}
          </ul>

          <h3>
            <FormattedMessage id="PRIVACY_POLICY.RETENTION_OF_YOUR_PERSONAL_DATA" />
          </h3>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.RETENTION_OF_YOUR_PERSONAL_DATA_DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.RETENTION_OF_YOUR_PERSONAL_DATA_DESCRIPTION_2" />
          </p>

          <h3>
            <FormattedMessage id="PRIVACY_POLICY.TRANSFER_OF_YOUR_PERSONAL_DATA" />
          </h3>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.TRANSFER_OF_YOUR_PERSONAL_DATA_DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.TRANSFER_OF_YOUR_PERSONAL_DATA_DESCRIPTION_2" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.TRANSFER_OF_YOUR_PERSONAL_DATA_DESCRIPTION_3" />
          </p>

          <h3>
            <FormattedMessage id="PRIVACY_POLICY.DISCLOSURE_OF_YOUR_PERSONAL_DATA" />
          </h3>
          <h4>
            <FormattedMessage id="PRIVACY_POLICY.BUSINESS_TRANSACTIONS" />
          </h4>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.BUSINESS_TRANSACTIONS_DESCRIPTION" />
          </p>

          <h4>
            <FormattedMessage id="PRIVACY_POLICY.LAW_ENFORCEMENT" />
          </h4>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.LAW_ENFORCEMENT_DESCRIPTION" />
          </p>

          <h4>
            <FormattedMessage id="PRIVACY_POLICY.OTHER_LEGAL_REQUIREMENTS" />
          </h4>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.OTHER_LEGAL_REQUIREMENTS_DESCRIPTION" />
          </p>
          <ul>
            {[1, 2, 3, 4, 5].map((num) => (
              <li key={`legal-req-${num}`}>
                <FormattedMessage
                  id={`PRIVACY_POLICY.OTHER_LEGAL_REQUIREMENTS_DESCRIPTION_${num}`}
                />
              </li>
            ))}
          </ul>

          <h3>
            <FormattedMessage id="PRIVACY_POLICY.SECURITY_OF_YOUR_PERSONAL_DATA" />
          </h3>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.SECURITY_OF_YOUR_PERSONAL_DATA_DESCRIPTION" />
          </p>

          <h2>
            <FormattedMessage id="PRIVACY_POLICY.CHILDRENS_PRIVACY" />
          </h2>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.CHILDRENS_PRIVACY_DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.CHILDRENS_PRIVACY_DESCRIPTION_2" />
          </p>

          <h2>
            <FormattedMessage id="PRIVACY_POLICY.LINKS_TO_OTHER_WEBSITES" />
          </h2>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.LINKS_TO_OTHER_WEBSITES_DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.LINKS_TO_OTHER_WEBSITES_DESCRIPTION_2" />
          </p>

          <h2>
            <FormattedMessage id="PRIVACY_POLICY.CHANGES_TO_THIS_PRIVACY_POLICY" />
          </h2>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.CHANGES_TO_THIS_PRIVACY_POLICY_DESCRIPTION_1" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.CHANGES_TO_THIS_PRIVACY_POLICY_DESCRIPTION_2" />
          </p>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.CHANGES_TO_THIS_PRIVACY_POLICY_DESCRIPTION_3" />
          </p>

          <h2>
            <FormattedMessage id="PRIVACY_POLICY.CONTACT_US" />
          </h2>
          <p>
            <FormattedMessage id="PRIVACY_POLICY.CONTACT_US_DESCRIPTION" />
          </p>
          <ul>
            <li key="contact-email">
              <FormattedMessage
                id="PRIVACY_POLICY.CONTACT_US_EMAIL"
                values={{ email: <a href="mailto:skynasa2024@gmail.com">skynasa2024@gmail.com</a> }}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
