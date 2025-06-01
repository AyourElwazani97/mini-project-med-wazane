"use client"

import { Badge } from "@/components/ui/badge"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AlertTriangle, Calendar, Clock, Copy, Mail } from "lucide-react"
import { toast } from "sonner"

interface Invitation {
  id: number
  nom_ref: string
  date_expiration: string
  time_left?: string
}

interface InvitationsTableProps {
  invitations: Invitation[]
}

export default function InvitationsTable({ invitations }: InvitationsTableProps) {
  const getExpirationBadge = (timeLeft: string) => {
    if (timeLeft === "Éxpiré") {
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
        icon: AlertTriangle,
      }
    }
    return {
      variant: "default" as const,
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
      icon: Clock,
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Référence "${text}" copiée !`)
    } catch (err) {
      toast.error("Erreur lors de la copie")
    }
  }

  const expiredCount = invitations.filter((inv) => inv.time_left === "Éxpiré").length
  const activeCount = invitations.length - expiredCount

  return (
    <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative flex-1 overflow-hidden rounded-xl border">
      <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
      <div className="flex h-full flex-col">
        <div className="border-border bg-muted/50 border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">Invitations</h2>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground text-sm">
                  {activeCount} active{activeCount > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground text-sm">
                  {expiredCount} expirée{expiredCount > 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">{invitations.length} total</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {invitations.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Mail className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <h3 className="text-foreground mt-4 text-lg font-medium">Aucune invitation</h3>
                <p className="text-muted-foreground mt-2 text-sm">Les invitations envoyées apparaîtront ici.</p>
              </div>
            </div>
          ) : (
            <div className="min-h-[400px] overflow-auto">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm">
                  <TableRow className="border-border border-b hover:bg-transparent">
                    <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Référence
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Date d'expiration
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Statut
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Temps restant
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-border divide-y">
                  {invitations.map((invitation) => {
                    const badgeConfig = getExpirationBadge(invitation.time_left || "")
                    const BadgeIcon = badgeConfig.icon
                    const isExpired = invitation.time_left === "Éxpiré"

                    return (
                      <TableRow
                        key={invitation.id}
                        className={`group transition-colors duration-150 ${
                          isExpired ? "hover:bg-red-50/50 dark:hover:bg-red-950/20" : "hover:bg-muted/50"
                        }`}
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full p-2 ${
                                isExpired ? "bg-red-100 dark:bg-red-950/50" : "bg-blue-100 dark:bg-blue-950/50"
                              }`}
                            >
                              <Mail
                                className={`h-4 w-4 ${
                                  isExpired ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"
                                }`}
                              />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-medium ${
                                    isExpired
                                      ? "text-muted-foreground line-through"
                                      : "text-foreground group-hover:text-primary"
                                  } transition-colors`}
                                >
                                  {invitation.nom_ref}
                                </span>
                                {!isExpired && (
                                  <button
                                    onClick={() => copyToClipboard(invitation.nom_ref)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                                    title="Copier la référence"
                                  >
                                    <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                  </button>
                                )}
                              </div>
                              <span className="text-muted-foreground text-xs">ID: {invitation.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="text-foreground flex items-center gap-2 text-sm">
                            <Calendar className="text-muted-foreground h-4 w-4" />
                            <span className={isExpired ? "text-muted-foreground" : ""}>
                              {formatDate(invitation.date_expiration)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge
                            variant={badgeConfig.variant}
                            className={`${badgeConfig.className} flex w-fit items-center gap-1 border font-medium`}
                          >
                            <BadgeIcon className="h-3 w-3" />
                            {isExpired ? "Expirée" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="text-foreground flex items-center gap-2 text-sm">
                            <Clock className="text-muted-foreground h-4 w-4" />
                            <span
                              className={`font-medium ${
                                isExpired ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              {invitation.time_left || "Non défini"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
