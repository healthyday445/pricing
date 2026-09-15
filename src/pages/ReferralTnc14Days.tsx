import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

const ReferralTnc14Days = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col overflow-x-hidden">
      <SharedHeader />

      <main className="flex-grow flex flex-col items-center justify-center pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-5xl mx-auto my-8">
          
          <div className="mb-10" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-[2px] w-32 md:w-40 bg-[#feab27]"></div>
              <h2 className="text-[18px] md:text-[22px] font-bold text-[#0d468b]">Healthyday</h2>
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#202020]">Referral Contest - Terms & Conditions</h1>
          </div>

          <div 
            className="text-[#202020] space-y-8 leading-[1.8] text-[16px] font-medium" 
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <p>
              These Terms & Conditions govern participation in the Healthyday 14 Days Free Yoga Referral Contest. By participating in the contest, the participant (&ldquo;Referrer&rdquo;) agrees to abide by these Terms & Conditions.
            </p>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">1. Contest Duration & Eligibility</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>1.1</strong> The Referral Contest shall be applicable separately to each 14 Days Free Yoga batch.</li>
                <li><strong>1.2</strong> The contest period for each Referrer shall commence 7 days prior to the start date of the applicable 14 Days Free Yoga batch and shall end at 11:59 PM IST on the 14th day of the applicable batch.</li>
                <li><strong>1.3</strong> The applicable contest period shall be determined based on the batch in which the Referrer is enrolled.</li>
                <li><strong>1.4</strong> The Referrer must attend at least one Healthyday class during the applicable 14 Days Free Yoga batch to be eligible for leaderboard rewards.</li>
                <li><strong>1.5</strong> The Top 100 Referrers on the final leaderboard as of 11:59 PM IST on the applicable contest end date shall be considered eligible for leaderboard rewards, subject to verification and compliance with these Terms & Conditions.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">2. Eligible Referrals</h3>
              <p className="mb-3"><strong>2.1</strong> A referral shall be considered valid only if:</p>
              <ul className="list-disc pl-10 space-y-2 mb-4">
                <li>the referred user completes registration through the Referrer&rsquo;s referral link;</li>
                <li>the referred user registers using their own phone number and with their own knowledge and consent; and</li>
                <li>the referred user is eligible to participate as a first-time Healthyday participant.</li>
              </ul>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>2.2</strong> Only the first valid registration by an individual shall be counted as a referral.</li>
                <li><strong>2.3</strong> Individuals who have previously registered with Healthyday shall not qualify as new referrals, even if they register again. Healthyday&rsquo;s internal records shall be used to determine referral eligibility.</li>
                <li><strong>2.4</strong> Healthyday reserves the right to determine whether a referral is valid based on its internal records.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">3. Consent & Genuine Registrations</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>3.1</strong> Every referral must be made with the knowledge and consent of the referred individual.</li>
                <li><strong>3.2</strong> Referrers must not submit registrations on behalf of another person using their own device or without the referred person&rsquo;s explicit consent.</li>
                <li><strong>3.3</strong> If Healthyday determines that registrations were submitted without the referred person&rsquo;s knowledge or consent, the Referrer may be disqualified and/or blacklisted.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">4. Fraudulent Activity</h3>
              <p className="mb-3">The following activities are strictly prohibited:</p>
              <ul className="list-disc pl-10 space-y-2 mb-4">
                <li>Fake registrations</li>
                <li>Self-referrals</li>
                <li>Duplicate registrations</li>
                <li>Multiple registrations by the same individual</li>
                <li>Registrations using temporary, virtual or disposable phone numbers</li>
                <li>Bot-generated registrations</li>
                <li>Automated scripts or bulk submission software</li>
                <li>Any attempt to manipulate referral counts or leaderboard rankings</li>
              </ul>
              <p>Healthyday reserves the right to determine whether any activity is fraudulent and may remove such referrals and/or disqualify or blacklist the Referrer.</p>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">5. Referral Rewards</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>5.1</strong> The following rewards shall be applicable based on the number of valid referrals and final leaderboard position:
                  <ul className="list-disc pl-8 mt-2 space-y-1">
                    <li><strong>1 Valid Referral:</strong> e-Diet PDF</li>
                    <li><strong>3 Valid Referrals:</strong> 1-Month Additional Subscription Voucher</li>
                    <li><strong>Ranks 1&ndash;3:</strong> Yoga Kit + Face Towel + Weight Scale</li>
                    <li><strong>Ranks 4&ndash;10:</strong> Yoga Kit + Face Towel</li>
                    <li><strong>Ranks 11&ndash;100:</strong> Yoga Kit</li>
                  </ul>
                </li>
                <li><strong>5.2</strong> The Yoga Kit shall consist of a Yoga Mat, Healthyday T-shirt and Water Bottle.</li>
                <li><strong>5.3</strong> The 1-Month Additional Subscription Voucher can be claimed after successful purchase of an eligible Healthyday subscription and shall be subject to the applicable voucher terms.</li>
                <li><strong>5.4</strong> Rewards are non-transferable, non-exchangeable and cannot be redeemed for cash.</li>
                <li><strong>5.5</strong> Reward images shown in promotional materials are for illustration purposes only. Actual products may vary in colour, size, model, brand, packaging, specifications or design based on availability.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">6. Leaderboard & Verification</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>6.1</strong> The leaderboard may be periodically refreshed and may not reflect real-time referral activity.</li>
                <li><strong>6.2</strong> The final leaderboard used for determining winners shall be based on Healthyday&rsquo;s verified internal records as of 11:59 PM IST on the applicable contest end date.</li>
                <li><strong>6.3</strong> Winning a leaderboard position does not automatically guarantee a reward. Participants and referrals shall be subject to verification and fraud checks.</li>
                <li><strong>6.4</strong> Healthyday reserves the right to reject or remove invalid referrals, modify referral counts, disqualify participants, blacklist participants or withhold rewards pending verification or investigation.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">7. Reward Communication & Delivery</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>7.1</strong> Winners shall be intimated via WhatsApp regarding their reward eligibility and reward claim process.</li>
                <li><strong>7.2</strong> Winners must submit the required reward claim details within 7 days from the date of intimation.</li>
                <li><strong>7.3</strong> Failure to submit the required details within the stipulated period may result in cancellation of the reward.</li>
                <li><strong>7.4</strong> Reward dispatch timelines may vary depending on product availability, customisation and logistics.</li>
                <li><strong>7.5</strong> Healthyday may request an alternate serviceable address if the winner&rsquo;s provided address is outside the applicable courier service area.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">8. Healthyday Rights</h3>
              <p className="mb-3">Healthyday reserves the absolute right to:</p>
              <ul className="list-disc pl-10 space-y-2 mb-4">
                <li>verify referrals and participant eligibility;</li>
                <li>reject or remove any referral;</li>
                <li>modify referral counts;</li>
                <li>disqualify or blacklist participants;</li>
                <li>withhold rewards pending verification or investigation;</li>
                <li>modify, suspend or cancel the Referral Contest where necessary.</li>
              </ul>
              <p>Healthyday&rsquo;s decision regarding referral validity, leaderboard rankings, participant eligibility and reward eligibility shall be final and binding.</p>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">9. Support & Queries</h3>
              <p className="mb-3">Queries regarding referral count, leaderboard rank, referral validity, reward eligibility or reward delivery may be sent to: <a href="mailto:contact@healthyday.co.in" className="text-[#0d468b] hover:underline font-semibold">contact@healthyday.co.in</a></p>
              <p>Healthyday aims to respond to such queries within 7 business days.</p>
            </section>

            <section>
              <h3 className="text-[24px] font-semibold text-[#0d468b] mb-4">10. General Terms</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>10.1</strong> Healthyday reserves the right to amend these Terms & Conditions where necessary. Any updated Terms & Conditions shall become effective upon publication.</li>
                <li><strong>10.2</strong> In the event of any dispute relating to referral eligibility, leaderboard rankings, rewards, interpretation of these Terms & Conditions or any other matter relating to the Referral Contest, Healthyday&rsquo;s decision shall be final and binding.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
};

export default ReferralTnc14Days;
