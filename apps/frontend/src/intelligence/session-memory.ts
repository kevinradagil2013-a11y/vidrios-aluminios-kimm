import type { ProjectProfile } from "./project-intelligence";

const STORAGE_KEY = "kimm.project.v1";

export interface KimmSessionProject {
  description: string;
  profile: ProjectProfile;
  updatedAt: number;
}

export function saveProjectSession(
  description: string,
  profile: ProjectProfile,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const sessionProject: KimmSessionProject = {
    description,
    profile,
    updatedAt: Date.now(),
  };

  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sessionProject),
  );
}

export function loadProjectSession(): KimmSessionProject | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as KimmSessionProject;

    if (
      typeof parsed.description !== "string" ||
      !parsed.profile ||
      typeof parsed.updatedAt !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearProjectSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}