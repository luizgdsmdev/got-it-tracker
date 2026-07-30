import React, { useState, useEffect } from "react";
import {
  Bell,
  LogOut,
  Check,
  Languages,
  Moon,
  Sun,
  Menu,
  ShieldAlert,
  ArrowUp,
  Plus,
  Map,
  UserPlus,
  PlusCircle,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CreatePersonModal from "./components/dashboard/CreatePersonModal";
import EditProfileModal from "./components/dashboard/EditProfileModal";
import EditTransactionModal from "./components/dashboard/EditTransactionModal";
import ToastContainer, { ToastMessage } from "./components/ui/Toast";
import {
  ScreenId,
  Person,
  Transaction,
  Playground,
  Approval,
  GlobalSettings,
} from "./types";
import {
  initialPeople,
  initialTransactions,
  initialPlaygrounds,
  initialApprovals,
  initialSettings,
} from "./data";
import {
  isAuthenticated,
  getAuthUser,
  clearAuthData,
  ApiError,
  revokeApi,
  updateUserApi,
  refreshTokenApi,
  setOnAuthErrorCallback,
  isTokenExpired,
} from "./services/api";
import {
  createPlaygroundApi,
  getPlaygroundByIdApi,
  getUserPlaygroundsApi,
  getAllPlaygroundsApi,
  toggleApprovalApi,
  updatePlaygroundApi,
  deletePlaygroundApi,
  PlaygroundApiItem,
} from "./services/playgroundService";
import {
  getAllPersonTransactionsApi,
  createTransactionApi,
  mapApiTransactionToFrontend,
  mapTypeStringToNumber,
} from "./services/transactionService";
import {
  getApprovalRequestsByPlaygroundIdApi,
  approveApprovalRequestApi,
  rejectApprovalRequestApi,
  mapApiApprovalToFrontend,
  ApiApprovalRequest,
} from "./services/approvalService";

// Import Views
import DashboardView from "./components/DashboardView";
import PeopleView from "./components/PeopleView";
import ReportsView from "./components/ReportsView";
import AdminView from "./components/AdminView";
import PlaygroundsView from "./components/PlaygroundsView";
import AddTransactionView from "./components/AddTransactionView";
import ConfigurePlaygroundView from "./components/ConfigurePlaygroundView";
import ApprovalsView from "./components/ApprovalsView";
import LoginView from "./components/LoginView";
import Sidebar from "./components/Sidebar";
import PlaygroundDetailView from "./components/PlaygroundDetailView";

import { translations } from "./translations";

const getInitialCurrentUser = (): Person => {
  const authUser = getAuthUser();
  if (authUser) {
    const initials =
      (authUser.name || "User")
        .split(" ")
        .filter(Boolean)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "US";

    return {
      id: authUser.id || "",
      name: authUser.name || "",
      email: authUser.email || "",
      initials,
      age: authUser.age ?? 0,
      tag: `${Math.floor(1000 + Math.random() * 9000)}-U`,
      role: (authUser.age ?? 0) >= 18 ? "Adult User" : "Teenager (Minor)",
      spendingLimit: (authUser.age ?? 0) >= 18 ? 2500 : 250,
      permissionEnabled: true,
      colorTheme: "bg-[#e2dfff] text-[#100563]",
    };
  }
  return {
    id: "",
    name: "",
    email: "",
    initials: "",
    age: 0,
    tag: "",
    role: "",
    spendingLimit: 0,
    permissionEnabled: false,
    colorTheme: "bg-slate-100 text-slate-700",
  };
};

export default function App() {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [playgrounds, setPlaygrounds] =
    useState<Playground[]>(initialPlaygrounds);
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [settings, setSettings] = useState<GlobalSettings>(initialSettings);

  const [currentScreen, setCurrentScreen] = useState<ScreenId>("dashboard");
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<
    string | null
  >(null);
  const [currentUser, setCurrentUser] = useState<Person>(getInitialCurrentUser);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sidebar state for mobile layout
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Language translation selector (PT/EN)
  const [lang, setLang] = useState<"pt" | "en">("pt");

  // Speed Dial FAB state
  const [isFabOpen, setIsFabOpen] = useState(false);

  // New Person modal state
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);

  // Edit Transaction modal state
  const [selectedTransactionForEdit, setSelectedTransactionForEdit] =
    useState<Transaction | null>(null);

  // Approval requests loading state
  const [isRefreshingApprovals, setIsRefreshingApprovals] = useState(false);

  // Scroll to top states and behavior
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setShowScrollTop(window.scrollY > scrollHeight / 2);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const start = window.scrollY || document.documentElement.scrollTop;
    const duration = 400; // ms
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const ease = progress * (2 - progress);

      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

  // Load from localStorage if present to maintain durability
  useEffect(() => {
    const savedPeople = localStorage.getItem("sl_people");
    const savedTrans = localStorage.getItem("sl_transactions");
    const savedApps = localStorage.getItem("sl_approvals");
    const savedSet = localStorage.getItem("sl_settings");
    const savedLang = localStorage.getItem("sl_lang");
    const savedPlaygrounds = localStorage.getItem("sl_playgrounds");

    if (savedPeople) {
      try {
        const parsedPeople = JSON.parse(savedPeople);
        if (Array.isArray(parsedPeople)) {
          const filtered = parsedPeople.filter(
            (p) =>
              p &&
              p.id &&
              !["p1", "p2", "p3", "p4", "p5"].includes(p.id.toLowerCase()) &&
              !["james doe", "sarah doe", "alex rivera"].includes(
                (p.name || "").toLowerCase(),
              ),
          );
          setPeople(filtered);
        }
      } catch (e) {
        // Fallback
      }
    }
    if (savedTrans) setTransactions(JSON.parse(savedTrans));
    if (savedApps) setApprovals(JSON.parse(savedApps));
    if (savedSet) setSettings(JSON.parse(savedSet));
    if (savedPlaygrounds) {
      try {
        const parsed = JSON.parse(savedPlaygrounds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlaygrounds(parsed);
        }
      } catch (e) {
        // Fallback
      }
    }

    const savedDark = localStorage.getItem("sl_dark");
    if (savedDark) {
      try {
        const isDark = JSON.parse(savedDark);
        setDarkMode(isDark);
      } catch (e) {
        // Fallback
      }
    }

    if (savedLang) {
      try {
        const parsedLang = JSON.parse(savedLang);
        if (parsedLang === "pt" || parsedLang === "en") {
          setLang(parsedLang);
        } else {
          setLang("pt");
        }
      } catch (e) {
        if (savedLang === "pt" || savedLang === "en") {
          setLang(savedLang as "pt" | "en");
        } else {
          setLang("pt");
        }
      }
    }

    // Auth error handler for automatic redirect to login when refresh fails
    const handleAuthError = () => {
      clearAuthData();
      setCurrentScreen("login");
      addToast({
        type: "error",
        title: lang === "pt" ? "Sessão Expirada" : "Session Expired",
        message:
          lang === "pt"
            ? "Sua sessão expirou. Faça login novamente."
            : "Your session expired. Please log in again.",
      });
    };

    setOnAuthErrorCallback(handleAuthError);
    const handleAuthUnauthorizedEvent = () => handleAuthError();
    window.addEventListener("auth:unauthorized", handleAuthUnauthorizedEvent);

    // Check authentication on startup
    if (!isAuthenticated()) {
      setCurrentScreen("login");
    } else {
      if (isTokenExpired()) {
        refreshTokenApi()
          .then(() => {
            // Refreshed successfully
          })
          .catch((err) => {
            console.warn("Initial token refresh failed:", err);
            handleAuthError();
          });
      }

      const authUser = getAuthUser();
      if (authUser) {
        const initials =
          (authUser.name || "User")
            .split(" ")
            .filter(Boolean)
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2) || "US";

        const personUser: Person = {
          id: authUser.id || "",
          name: authUser.name || "",
          email: authUser.email || "",
          initials,
          age: authUser.age ?? 0,
          tag: `${Math.floor(1000 + Math.random() * 9000)}-U`,
          role: (authUser.age ?? 0) >= 18 ? "Adult User" : "Teenager (Minor)",
          spendingLimit: (authUser.age ?? 0) >= 18 ? 2500 : 250,
          permissionEnabled: true,
          colorTheme: "bg-[#e2dfff] text-[#100563]",
        };
        setCurrentUser(personUser);
      }
    }

    return () => {
      setOnAuthErrorCallback(null);
      window.removeEventListener(
        "auth:unauthorized",
        handleAuthUnauthorizedEvent,
      );
    };
  }, []);

  // Synchronize documentElement class and colorScheme whenever darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [darkMode]);

  // Fetch playgrounds from backend API (GET https://localhost:7189/api/Playgrounds/all)
  const fetchUserPlaygrounds = async (userId?: string) => {
    if (!isAuthenticated()) return;

    try {
      const apiItems = await getAllPlaygroundsApi();

      if (Array.isArray(apiItems)) {
        const defaultImages = [
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
        ];
        const mapped: Playground[] = apiItems.map((item, index) => {
          return {
            id: item.playGroundId,
            name: item.name,
            description: item.description,
            ownerName: currentUser?.name || "Luiz",
            owner: item.ownerId,
            balance: 0,
            progress: 0,
            image: defaultImages[index % defaultImages.length],
            requireVerification: item.askForApproval,
            requireApproval: item.askForApproval,
            memberIds: [item.ownerId],
          };
        });
        setPlaygrounds(mapped);
        saveState("sl_playgrounds", mapped);
      }
    } catch (err: any) {
      console.warn("Backend API fetchUserPlaygrounds failed:", err);
      if (err.statusCode !== 404 && err.status !== 404) {
        addToast({
          type: "error",
          title: err.errorType || (lang === "pt" ? "Erro na API" : "API Error"),
          message:
            err.message ||
            (lang === "pt"
              ? "Não foi possível carregar os playgrounds."
              : "Unable to load playgrounds."),
          statusCode: err.statusCode,
          traceId: err.traceId,
        });
      }
    }
  };

  // Fetch approval requests from backend API (https://localhost:7189/api/ApprovalRequests/playground/{playgroundId})
  const fetchUserApprovalRequests = async (userPlaygrounds?: Playground[]) => {
    if (!isAuthenticated()) return;
    const targetPlaygrounds = userPlaygrounds || playgrounds;
    if (!targetPlaygrounds || targetPlaygrounds.length === 0) return;

    setIsRefreshingApprovals(true);
    try {
      const allFetched: Approval[] = [];
      for (const p of targetPlaygrounds) {
        try {
          const apiApps = await getApprovalRequestsByPlaygroundIdApi(p.id);
          if (Array.isArray(apiApps)) {
            const mapped = apiApps.map((a) =>
              mapApiApprovalToFrontend(a, p.name, people),
            );
            allFetched.push(...mapped);
          }
        } catch (e: any) {
          // Silent catch for permission or not-found errors when checking playground approval requests
          console.log(
            `Approval requests check for playground ${p.id}:`,
            e?.message || e,
          );
        }
      }
      setApprovals(allFetched);
      saveState("sl_approvals", allFetched);
    } catch (err: any) {
      console.warn("Backend API fetchUserApprovalRequests failed:", err);
    } finally {
      setIsRefreshingApprovals(false);
    }
  };

  // Fetch transactions from backend API (https://localhost:7189/api/transactions/all)
  const fetchUserTransactions = async () => {
    if (!isAuthenticated()) return;
    try {
      const apiItems = await getAllPersonTransactionsApi();
      if (Array.isArray(apiItems)) {
        const mapped = apiItems.map(mapApiTransactionToFrontend);
        setTransactions(mapped);
        saveState("sl_transactions", mapped);
      }
    } catch (err: any) {
      console.warn("Backend API getAllPersonTransactions failed:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && currentUser && currentUser.id) {
      fetchUserPlaygrounds(currentUser.id);
      fetchUserTransactions();
    }
  }, [currentUser.id]);

  // Save to localStorage helper
  const saveState = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const handleLangToggle = () => {
    const nextLang = lang === "pt" ? "en" : "pt";
    setLang(nextLang);
    saveState("sl_lang", nextLang);
  };

  // State update handlers
  const handleAddPerson = (
    newPerson: Omit<Person, "id" | "initials" | "colorTheme"> & {
      id?: string;
      initials?: string;
      colorTheme?: string;
    },
    playgroundIds?: string[],
  ) => {
    const initials =
      newPerson.initials ||
      newPerson.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    const personId = newPerson.id || `p_${Date.now()}`;
    const person: Person = {
      ...newPerson,
      id: personId,
      initials,
      colorTheme: newPerson.colorTheme || "bg-[#e2dfff] text-[#100563]",
    };

    const updatedPeople = [...people, person];
    setPeople(updatedPeople);
    saveState("sl_people", updatedPeople);

    // If playgroundIds are specified, associate the person to those playgrounds
    if (playgroundIds && playgroundIds.length > 0) {
      const updatedPlaygrounds = playgrounds.map((play) => {
        if (playgroundIds.includes(play.id)) {
          const currentMemberIds = play.memberIds || [];
          if (!currentMemberIds.includes(personId)) {
            return {
              ...play,
              memberIds: [...currentMemberIds, personId],
            };
          }
        }
        return play;
      });
      setPlaygrounds(updatedPlaygrounds);
      saveState("sl_playgrounds", updatedPlaygrounds);
    }
  };

  const handleDeletePerson = (id: string) => {
    const updated = people.filter((p) => p.id !== id);
    setPeople(updated);
    saveState("sl_people", updated);

    // If deleted current user, reset to first available
    if (currentUser.id === id && updated.length > 0) {
      setCurrentUser(updated[0]);
    }
  };

  const handleAddTransaction = async (
    newTrans: Omit<Transaction, "id" | "date">,
  ) => {
    if (newTrans.playgroundId) {
      try {
        const createdApiTx = await createTransactionApi(newTrans.playgroundId, {
          playgroundId: newTrans.playgroundId,
          personId: newTrans.personId || currentUser.id,
          description: newTrans.description,
          amount: Number(newTrans.value),
          type: mapTypeStringToNumber(newTrans.type),
          isPublic: newTrans.isPublic !== undefined ? newTrans.isPublic : true,
        });

        // Re-fetch all transactions directly from the backend API to ensure 100% data fidelity
        await fetchUserTransactions();

        addToast({
          type: "success",
          title: lang === "pt" ? "Transação Criada" : "Transaction Created",
          message:
            lang === "pt"
              ? "Transação salva com sucesso no servidor!"
              : "Transaction saved successfully!",
        });
        return createdApiTx
          ? mapApiTransactionToFrontend(createdApiTx)
          : undefined;
      } catch (err: any) {
        console.error("Create transaction API error:", err);
        addToast({
          type: "error",
          title:
            err.errorType ||
            (lang === "pt" ? "Erro ao Criar" : "Creation Error"),
          message:
            err.message ||
            (lang === "pt"
              ? "Erro ao salvar transação."
              : "Failed to save transaction."),
          statusCode: err.statusCode,
          traceId: err.traceId,
        });
        throw err;
      }
    }

    const trans: Transaction = {
      ...newTrans,
      id: `t_${Date.now()}`,
      date:
        "Hoje, " +
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    const updated = [trans, ...transactions];
    setTransactions(updated);
    saveState("sl_transactions", updated);
  };

  const handleAddPlayground = async (
    newPlay: Omit<Playground, "id" | "balance" | "progress">,
  ) => {
    try {
      await createPlaygroundApi({
        ownerId: currentUser.id,
        name: newPlay.name,
        description: newPlay.description,
        askForApproval: !!newPlay.requireVerification,
      });
      addToast({
        type: "success",
        title: lang === "pt" ? "Playground Criado" : "Playground Created",
        message:
          lang === "pt"
            ? "Playground salvo com sucesso no servidor."
            : "Playground saved successfully.",
      });
      if (currentUser?.id) {
        await fetchUserPlaygrounds(currentUser.id);
      }
    } catch (err: any) {
      console.warn("Backend API createPlayground failed:", err);
      addToast({
        type: "error",
        title:
          err.errorType || (lang === "pt" ? "Erro ao Criar" : "Creation Error"),
        message:
          err.message ||
          (lang === "pt"
            ? "Erro ao criar o playground."
            : "Error creating playground."),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    }
  };

  const handleApproveRejectApproval = async (
    id: string,
    status: "approved" | "rejected",
    reason?: string,
  ) => {
    try {
      let updatedApiApp: ApiApprovalRequest;
      if (status === "approved") {
        updatedApiApp = await approveApprovalRequestApi({
          approvalRequestId: id,
          reasonDescription:
            reason ||
            (lang === "pt" ? "Solicitação Aprovada" : "Request Approved"),
        });
      } else {
        updatedApiApp = await rejectApprovalRequestApi({
          rejectRequestId: id,
          reasonDescription:
            reason ||
            (lang === "pt" ? "Solicitação Rejeitada" : "Request Rejected"),
        });
      }

      const play = playgrounds.find((p) => p.id === updatedApiApp.playgroundId);
      const updatedApproval = mapApiApprovalToFrontend(
        updatedApiApp,
        play?.name || "Playground",
        people,
      );

      const updatedApps = approvals.map((app) =>
        app.id === id ? updatedApproval : app,
      );
      setApprovals(updatedApps);
      saveState("sl_approvals", updatedApps);

      addToast({
        type: "success",
        title:
          status === "approved"
            ? lang === "pt"
              ? "Aprovação Confirmada"
              : "Approval Confirmed"
            : lang === "pt"
              ? "Rejeição Confirmada"
              : "Rejection Confirmed",
        message:
          status === "approved"
            ? lang === "pt"
              ? "Solicitação aprovada no servidor com sucesso."
              : "Approval request approved on server successfully."
            : lang === "pt"
              ? "Solicitação rejeitada no servidor com sucesso."
              : "Approval request rejected on server successfully.",
      });

      if (status === "approved") {
        fetchUserTransactions();
      }
    } catch (err: any) {
      console.error(`Backend API approve/reject error for ${id}:`, err);

      // Local fallback state
      const updated = approvals.map((app) => {
        if (app.id === id) {
          return { ...app, status, reason };
        }
        return app;
      });
      setApprovals(updated);
      saveState("sl_approvals", updated);

      addToast({
        type: "error",
        title:
          err.errorType ||
          (lang === "pt" ? "Erro na Solicitação" : "Request Error"),
        message:
          err.message ||
          (lang === "pt"
            ? "Não foi possível atualizar a solicitação."
            : "Failed to update request."),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    }
  };

  const handleUpdateSettings = (newSettings: Partial<GlobalSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveState("sl_settings", updated);
  };

  const handleUpdatePersonLimit = (id: string, limit: number) => {
    const updated = people.map((p) => {
      if (p.id === id) {
        return { ...p, spendingLimit: limit };
      }
      return p;
    });
    setPeople(updated);
    saveState("sl_people", updated);
  };

  const handleUpdatePersonPermission = (id: string, enabled: boolean) => {
    const updated = people.map((p) => {
      if (p.id === id) {
        return { ...p, permissionEnabled: enabled };
      }
      return p;
    });
    setPeople(updated);
    saveState("sl_people", updated);
  };

  const handleNavigate = (screen: ScreenId, playgroundId?: string) => {
    if (!isAuthenticated() && screen !== "login") {
      setCurrentScreen("login");
      return;
    }
    if (playgroundId) {
      setSelectedPlaygroundId(playgroundId);
    }
    setCurrentScreen(screen);
    if (screen === "approvals") {
      fetchUserApprovalRequests();
    }
  };

  const handleUpdatePlayground = async (updatedPlayground: Playground) => {
    try {
      await updatePlaygroundApi(updatedPlayground.id, {
        name: updatedPlayground.name,
        description: updatedPlayground.description,
        askForApproval: !!updatedPlayground.requireVerification,
      });
      addToast({
        type: "success",
        title: lang === "pt" ? "Playground Atualizado" : "Playground Updated",
        message:
          lang === "pt"
            ? "Alterações salvas com sucesso."
            : "Changes saved successfully.",
      });
      if (currentUser?.id) {
        await fetchUserPlaygrounds(currentUser.id);
      }
    } catch (err: any) {
      console.warn("Backend API updatePlayground failed:", err);
      addToast({
        type: "error",
        title:
          err.errorType ||
          (lang === "pt" ? "Erro ao Atualizar" : "Update Error"),
        message:
          err.message ||
          (lang === "pt"
            ? "Falha ao atualizar o playground."
            : "Failed to update playground."),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    }
  };

  const handleToggleApproval = async (playgroundId: string) => {
    try {
      await toggleApprovalApi(playgroundId);
      addToast({
        type: "success",
        title: lang === "pt" ? "Aprovação Alterada" : "Approval Changed",
        message:
          lang === "pt"
            ? "Requisito de aprovação alterado com sucesso."
            : "Approval requirement toggled successfully.",
      });
      if (currentUser?.id) {
        await fetchUserPlaygrounds(currentUser.id);
      }
    } catch (err: any) {
      console.warn("Backend API toggleApproval failed:", err);
      addToast({
        type: "error",
        title:
          err.errorType ||
          (lang === "pt" ? "Erro de Aprovação" : "Approval Error"),
        message:
          err.message ||
          (lang === "pt"
            ? "Não foi possível alterar a aprovação."
            : "Could not change approval setting."),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    }
  };

  const handleDeletePlayground = async (playgroundId: string) => {
    try {
      await deletePlaygroundApi(playgroundId);
      addToast({
        type: "info",
        title: lang === "pt" ? "Playground Removido" : "Playground Removed",
        message:
          lang === "pt"
            ? "Playground excluído com sucesso."
            : "Playground deleted successfully.",
      });
      if (currentUser?.id) {
        await fetchUserPlaygrounds(currentUser.id);
      }
    } catch (err: any) {
      console.warn("Backend API deletePlayground failed:", err);
      addToast({
        type: "error",
        title:
          err.errorType ||
          (lang === "pt" ? "Erro ao Deletar" : "Deletion Error"),
        message:
          err.message ||
          (lang === "pt"
            ? "Não foi possível excluir o playground."
            : "Could not delete playground."),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    }
  };

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    saveState("sl_dark", nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLoginSuccess = (authUser: any, accessToken?: string) => {
    const userEmail =
      typeof authUser === "string"
        ? authUser
        : authUser?.email || "user@company.com";
    const userName =
      typeof authUser === "object" && authUser?.name ? authUser.name : "Luiz";
    const userAge =
      typeof authUser === "object" && authUser?.age ? authUser.age : 28;
    const userId =
      typeof authUser === "object" && authUser?.id
        ? authUser.id
        : `p_${Date.now()}`;

    const initials =
      userName
        .split(" ")
        .filter(Boolean)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "LU";

    const personUser: Person = {
      id: userId,
      name: userName,
      email: userEmail,
      initials,
      age: userAge,
      tag: `${Math.floor(1000 + Math.random() * 9000)}-U`,
      role: userAge >= 18 ? "Adult User" : "Teenager (Minor)",
      spendingLimit: userAge >= 18 ? 2500 : 250,
      permissionEnabled: true,
      colorTheme: "bg-[#e2dfff] text-[#100563]",
    };

    setCurrentUser(personUser);

    setPeople((prev) => {
      if (
        !prev.some(
          (p) =>
            p.id === personUser.id ||
            (p.email && p.email.toLowerCase() === userEmail.toLowerCase()),
        )
      ) {
        const updated = [...prev, personUser];
        saveState("sl_people", updated);
        return updated;
      }
      return prev;
    });

    // Explicitly fetch user data after successful login
    fetchUserPlaygrounds(personUser.id);
    fetchUserTransactions();

    setCurrentScreen("dashboard");
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case "playground-detail": {
        const activePlay =
          playgrounds.find((p) => p.id === selectedPlaygroundId) ||
          playgrounds[0];
        return (
          <PlaygroundDetailView
            playground={activePlay}
            people={people}
            transactions={transactions}
            settings={settings}
            onUpdatePlayground={handleUpdatePlayground}
            onToggleApproval={handleToggleApproval}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
            onAddPerson={handleAddPerson}
            addToast={addToast}
            onSelectTransaction={(tx) => setSelectedTransactionForEdit(tx)}
            lang={lang}
          />
        );
      }
      case "people":
        return (
          <PeopleView
            people={people}
            onAddPerson={handleAddPerson}
            onDeletePerson={handleDeletePerson}
            lang={lang}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
          />
        );
      case "reports":
        return (
          <ReportsView
            people={people}
            transactions={transactions}
            playgrounds={playgrounds}
            settings={settings}
            lang={lang}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
          />
        );
      case "admin":
        return (
          <AdminView
            people={people}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onUpdatePersonLimit={handleUpdatePersonLimit}
            onUpdatePersonPermission={handleUpdatePersonPermission}
            lang={lang}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
          />
        );
      case "playgrounds":
        return (
          <PlaygroundsView
            playgrounds={playgrounds}
            transactions={transactions}
            settings={settings}
            onNavigate={(scr, payload) =>
              handleNavigate(scr as ScreenId, payload)
            }
            lang={lang}
          />
        );
      case "add-transaction":
        return (
          <AddTransactionView
            people={people}
            playgrounds={playgrounds}
            settings={settings}
            onAddTransaction={handleAddTransaction}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
            lang={lang}
            preSelectedPlaygroundId={selectedPlaygroundId}
            currentUser={currentUser}
          />
        );
      case "configure-playground":
        return (
          <ConfigurePlaygroundView
            people={people}
            currentUser={currentUser}
            settings={settings}
            onAddPlayground={handleAddPlayground}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
            lang={lang}
            onAddPerson={handleAddPerson}
          />
        );
      case "approvals":
        return (
          <ApprovalsView
            approvals={approvals}
            settings={settings}
            onApproveReject={handleApproveRejectApproval}
            lang={lang}
            onNavigate={(scr) => handleNavigate(scr as ScreenId)}
            onRefresh={() => fetchUserApprovalRequests()}
            isRefreshing={isRefreshingApprovals}
          />
        );
      case "login":
        return (
          <LoginView
            lang={lang}
            darkMode={darkMode}
            onToggleLang={handleLangToggle}
            onToggleTheme={toggleDarkMode}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "dashboard":
      default:
        return (
          <DashboardView
            transactions={transactions}
            people={people}
            playgrounds={playgrounds}
            settings={settings}
            onNavigate={(scr, payload) =>
              handleNavigate(scr as ScreenId, payload)
            }
            onAddPerson={handleAddPerson}
            currentUser={currentUser}
            onSelectTransaction={(tx) => setSelectedTransactionForEdit(tx)}
            lang={lang}
          />
        );
    }
  };

  const handleSelectUser = (user: Person) => {
    setCurrentUser(user);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    const authUser = getAuthUser();
    if (authUser?.id) {
      try {
        await revokeApi(authUser.id);
      } catch (err) {
        console.warn("Backend revoke failed or offline:", err);
      }
    }
    clearAuthData();
    addToast({
      type: "info",
      title: lang === "pt" ? "Sessão Encerrada" : "Logged Out",
      message:
        lang === "pt" ? "Você saiu do sistema." : "You have been logged out.",
    });
    setCurrentScreen("login");
  };

  const t = translations[lang];

  // If we are on the login page, render full screen without the top header and sidebar structure!
  if (currentScreen === "login") {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-200 ${darkMode ? "dark" : ""}`}
      >
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />

        <div className="w-full">{renderActiveScreen()}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex bg-slate-50 text-slate-900 transition-colors duration-200 ${darkMode ? "dark bg-slate-950 text-slate-100" : ""}`}
    >
      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* 1. COLLAPSIBLE SIDEBAR NAVIGATION (Hides when clicked outside) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(scr) => handleNavigate(scr as ScreenId)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onEditProfile={() => setIsEditProfileOpen(true)}
        lang={lang}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        lang={lang}
        currentUser={currentUser}
        onProfileUpdated={(updatedUser) => {
          setCurrentUser((prev) => {
            const newAge = updatedUser.age ?? prev.age;
            return {
              ...prev,
              name: updatedUser.name || prev.name,
              email: updatedUser.email || prev.email,
              age: newAge,
              role: newAge >= 18 ? "Adult User" : "Teenager (Minor)",
              spendingLimit: newAge >= 18 ? 2500 : 250,
            };
          });
        }}
        addToast={addToast}
      />

      {/* Main Screen Container (Right of Sidebar) */}
      <div className="flex-grow min-h-screen flex flex-col overflow-x-hidden">
        {/* Main Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 h-16 shadow-sm flex items-center justify-between px-6 transition-colors duration-200">
          <div className="flex items-center gap-3">
            {/* Hamburger trigger for sidebar drawer */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Action Controls next to each other */}
          <div className="flex items-center gap-2">
            {/* 2. ENGLISH / PORTUGUESE LANGUAGE SWITCH TOGGLE */}
            <button
              onClick={handleLangToggle}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-black transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
              title={
                lang === "pt" ? "Mudar para Inglês" : "Switch to Portuguese"
              }
            >
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === "pt" ? "EN" : "PT"}</span>
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 active:scale-95 transition-all cursor-pointer"
              title={
                lang === "pt"
                  ? "Alternar tema escuro/claro"
                  : "Toggle dark/light theme"
              }
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Notification bell commented out
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-[#1a146b] dark:text-indigo-400 active:scale-95 transition-all cursor-pointer"
                title={lang === 'pt' ? 'Notificações' : 'Notifications'}
              >
                <Bell className="w-4 h-4" />
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <p className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800">
                    {t.householdNotifications}
                  </p>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors text-xs space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Jordan Smith atingiu 80% do limite de gastos!
                      </p>
                      <span className="text-[9px] text-slate-400">Há 5 minutos • Alerta de Limite</span>
                    </div>
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors text-xs space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        James Doe solicitou aprovação para "Kitchen Renovation Phase 1".
                      </p>
                      <span className="text-[9px] text-slate-400">Há 1 hora • Aprovação Pendente</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
          {renderActiveScreen()}
        </main>

        {/* Circular Floating CTA with Speed Dial Menu & Scroll To Top (Global) */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          {/* Expandable Menu options */}
          <AnimatePresence>
            {isFabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="flex flex-col items-end gap-2.5"
              >
                {/* Option 1: Create Playground */}
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow whitespace-nowrap">
                    {t.ctaNewPlayground}
                  </span>
                  <button
                    onClick={() => {
                      handleNavigate("configure-playground");
                      setIsFabOpen(false);
                    }}
                    className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>

                {/* Option 2: Create New Person */}
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow whitespace-nowrap">
                    {t.ctaNewPerson}
                  </span>
                  <button
                    onClick={() => {
                      setIsPersonModalOpen(true);
                      setIsFabOpen(false);
                    }}
                    className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>

                {/* Option 3: Post Transaction */}
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow whitespace-nowrap">
                    {t.ctaPostTransaction}
                  </span>
                  <button
                    onClick={() => {
                      handleNavigate("add-transaction");
                      setIsFabOpen(false);
                    }}
                    className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-emerald-500 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Option 4: Approve Requests */}
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow whitespace-nowrap">
                    {t.ctaApproveRequests}
                  </span>
                  <button
                    onClick={() => {
                      handleNavigate("approvals");
                      setIsFabOpen(false);
                    }}
                    className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-amber-500 cursor-pointer"
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll To Top Button (Appears when scrolled halfway) */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                onClick={scrollToTop}
                className="w-14 h-14 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/80"
                title={lang === "pt" ? "Voltar ao topo" : "Back to top"}
              >
                <ArrowUp className="w-7 h-7" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Master trigger FAB */}
          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-14 h-14 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer relative z-50"
          >
            <Plus
              className={`w-7 h-7 transition-transform duration-300 ${isFabOpen ? "rotate-45" : ""}`}
            />
          </button>
        </div>

        {/* POPUP MODAL Form for creating a Person (Global) */}
        <AnimatePresence>
          <CreatePersonModal
            isOpen={isPersonModalOpen}
            onClose={() => setIsPersonModalOpen(false)}
            playgrounds={playgrounds}
            t={t}
            lang={lang}
            onAddPerson={handleAddPerson}
          />
        </AnimatePresence>

        {/* Modal for Editing/Deleting Transaction */}
        <AnimatePresence>
          {selectedTransactionForEdit && (
            <EditTransactionModal
              isOpen={!!selectedTransactionForEdit}
              onClose={() => setSelectedTransactionForEdit(null)}
              transaction={selectedTransactionForEdit}
              lang={lang}
              onTransactionUpdated={async (updatedTx) => {
                const updatedList = transactions.map((t) =>
                  t.id === updatedTx.id ? updatedTx : t,
                );
                setTransactions(updatedList);
                saveState("sl_transactions", updatedList);
                await fetchUserTransactions();
              }}
              onTransactionDeleted={async (txId) => {
                const updatedList = transactions.filter((t) => t.id !== txId);
                setTransactions(updatedList);
                saveState("sl_transactions", updatedList);
                await fetchUserTransactions();
              }}
              addToast={addToast}
            />
          )}
        </AnimatePresence>

        {/* Floating Warning for under-18 limits */}
        {currentUser.age < 18 && (
          <div className="bg-amber-500 text-white py-2 px-6 text-xs font-semibold text-center sticky bottom-0 z-20 shadow-lg flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{t.minorWarningText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
