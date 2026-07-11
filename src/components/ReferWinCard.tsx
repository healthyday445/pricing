import React from "react";
import { ShareReferralActions } from "@/components/ShareReferralActions";

/**
 * Reusable "Refer & Win" card — dark-blue card with title, subtitle,
 * share-link input, WhatsApp button, and "Your Referrals" link.
 *
 * Used across multiple dashboard sections (14DaysOngoing, Paid, Completed, etc.)
 */

interface ReferWinCardProps {
  shareLink: string;
  referralsUrl: string;
  showViewMore?: boolean;
  showTitle?: boolean;
  onCopyLink?: () => void;
  onWhatsAppShare?: () => void;
}

const ReferWinCard: React.FC<ReferWinCardProps> = ({ shareLink, referralsUrl, showViewMore = true, showTitle = true, onCopyLink, onWhatsAppShare }) => (
  <div
    style={{
      width: "100%",
      maxWidth: "358px",
      height: "auto",
      boxSizing: "border-box",
      borderRadius: "16px",
      background:
        "linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), #0D468B",
      boxShadow: "0 0 10px 0 rgba(0,0,0,0.25)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      justifyContent: "center",
    }}
  >
    {showTitle && (
      <div>
        <h3 className="text-[18px] sm:text-[19px] md:text-[21px] lg:text-[24px]" style={{ color: "#FFF", fontFamily: "Outfit", fontWeight: 700, lineHeight: "normal", margin: "0 0 0" }}>
          Refer &amp; Win
        </h3>
        <p className="text-[11px] sm:text-[11px] md:text-[12px] lg:text-[13px]" style={{ color: "#FFFCFC", fontFamily: "Outfit", fontWeight: 400, lineHeight: "normal", margin: "0 0 0" }}>
          Invite your friends &amp; family and get exciting gifts!
        </p>
      </div>
    )}
    {/* Share actions */}
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <ShareReferralActions shareLink={shareLink} referralsUrl={referralsUrl} showViewMore={showViewMore} onCopyLink={onCopyLink} onWhatsAppShare={onWhatsAppShare} />
    </div>
  </div>
);

export default ReferWinCard;
