export type UserRole =
  | 'DIRECTOR' | 'EDITOR' | 'MUSICIAN' | 'PRODUCER'
  | 'ACTOR' | 'CINEMATOGRAPHER' | 'VFX_ARTIST' | 'WRITER';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';

export type ProjectType =
  | 'FILM' | 'MUSIC' | 'WRITING' | 'PHOTOGRAPHY' | 'THEATRE' | 'DIGITAL';

export type NotificationType =
  | 'LIKE' | 'COMMENT' | 'REPLY' | 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'PORTFOLIO_COMMENT';

export type NotificationReferenceType = 'POST' | 'USER' | 'PORTFOLIO';

export type ConnectionStatus = 'PENDING_SENT' | 'PENDING_INCOMING' | 'ACCEPTED';

export type PortfolioCategory =
  | 'Short Film' | 'Music Video' | 'Documentary' | 'Ad Film' | 'Reel' | 'Photography' | 'Other';

export type CompanyType =
  | 'PRODUCTION_HOUSE' | 'STUDIO' | 'AGENCY' | 'OTT_PLATFORM' | 'OTHER';
