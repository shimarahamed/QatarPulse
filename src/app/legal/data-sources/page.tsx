export default function DataSourcesPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Data Sources</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <p>QatarPulse strives to provide the most accurate and comprehensive business directory in Qatar. Our data is aggregated from a variety of sources to ensure quality and timeliness.</p>

      <h2>Our Primary Data Sources Include:</h2>
      <ul>
        <li><strong>Public Records:</strong> Information available from governmental and public-sector databases, such as business registration portals.</li>
        <li><strong>Business Owners:</strong> Direct submissions and claims made by verified business owners through our platform. Business owners are responsible for the accuracy of the information they provide.</li>
        <li><strong>User Contributions:</strong> We value our community. Users can suggest new businesses, report closures, or submit corrections for existing listings. All user-submitted data is reviewed by our team before publication.</li>
        <li><strong>Third-Party Data Providers:</strong> We partner with reputable data providers who specialize in business listings and location data to enrich our directory.</li>
        <li><strong>Web Crawling:</strong> Our automated systems scan publicly available online sources, such as business websites and social media profiles, to gather information.</li>
      </ul>

      <h2>Data Verification and Accuracy</h2>
      <p>While we make every effort to ensure the accuracy of our data, information can change quickly. We employ both automated and manual processes to verify information, including:
      </p>
      <ul>
        <li>Cross-referencing data points from multiple sources.</li>
        <li>Regularly updating listings based on new information.</li>
        <li>Community-driven feedback and reporting tools.</li>
      </ul>
      <p>We do not guarantee the accuracy, completeness, or timeliness of any information on our site. We encourage users to verify critical information (like opening hours) directly with the business before visiting.</p>

      <h2>Reporting Inaccuracies</h2>
      <p>If you find any information on QatarPulse that is incorrect or out of date, please use the "Report an Issue" or "Suggest an Edit" feature on the business listing page, or contact us directly. We appreciate your help in keeping our directory accurate.</p>
    </div>
  );
}
