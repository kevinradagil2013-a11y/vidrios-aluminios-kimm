import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "../config/contact";
import type { ProjectProfile } from "../intelligence/project-intelligence";
import { buildProjectWhatsAppMessage } from "../intelligence/whatsapp-builder";

interface SmartWhatsAppButtonProps {
  profile: ProjectProfile;
  children: ReactNode;
  className?: string;
}

export function SmartWhatsAppButton({
  profile,
  children,
  className = "",
}: SmartWhatsAppButtonProps) {
  const message = buildProjectWhatsAppMessage(profile);

  return (
    <a
      className={className}
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={17} />
      {children}
    </a>
  );
}