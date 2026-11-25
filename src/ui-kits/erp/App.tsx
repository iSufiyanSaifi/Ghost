import * as React from "react"
import {
  BarChart3Icon,
  Building2Icon,
  CarIcon,
  IndianRupeeIcon,
  LayoutDashboardIcon,
  MoonIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  SunIcon,
  TriangleAlertIcon,
  UsersIcon,
  WrenchIcon,
  ClipboardCheckIcon,
  UserCogIcon,
  type LucideIcon,
} from "lucide-react"

import { MetricCard } from "@/components/ghost/metric-card"
import { PageHeader } from "@/components/ghost/page-header"
import { PlateNumber } from "@/components/ghost/plate-number"
import { StatusBadge, type StatusTone } from "@/components/ghost/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useTheme } from "@/hooks/use-theme"

/** Fictional demo data. */
interface Order {
  id: string
  customer: string
  vehicle: string
  reg: string
  service: string
  status: string
  tone: StatusTone
  amount: number
}

const ORDERS: Order[] = [
  { id: "SO-2026-0412", customer: "Rohan Mehta", vehicle: "Hyundai Creta", reg: "MH 12 AB 1234", service: "Periodic service", status: "In workshop", tone: "info", amount: 12480 },
  { id: "SO-2026-0411", customer: "Anita Deshpande", vehicle: "Maruti Swift", reg: "MH 14 CD 5678", service: "Brake overhaul", status: "Awaiting approval", tone: "pending", amount: 8920 },
  { id: "SO-2026-0409", customer: "Vikram Rao", vehicle: "Tata Nexon", reg: "KA 03 EF 9012", service: "AC repair", status: "Quality check", tone: "warning", amount: 15300 },
  { id: "SO-2026-0405", customer: "Sana Khan", vehicle: "Honda City", reg: "MH 01 GH 3456", service: "Full inspection", status: "Ready for delivery", tone: "success", amount: 3200 },
]

const NAV: { label: string; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutDashboardIcon },
  { label: "CRM", icon: UsersIcon },
  { label: "Vehicles", icon: CarIcon },
  { label: "Workshop", icon: WrenchIcon },
  { label: "Inventory", icon: PackageIcon },
  { label: "Procurement", icon: ShoppingCartIcon },
  { label: "Finance", icon: IndianRupeeIcon },
  { label: "Workforce", icon: UserCogIcon },
  { label: "Reports", icon: BarChart3Icon },
  { label: "Branches", icon: Building2Icon },
  { label: "Settings", icon: SettingsIcon },
]

const FILTERS = ["All", "In workshop", "Awaiting approval"] as const
const inr = (n: number) => "₹" + n.toLocaleString("en-IN")

export function App() {
  const { theme, setTheme } = useTheme()
  const [active, setActive] = React.useState("Overview")
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All")
  const rows = filter === "All" ? ORDERS : ORDERS.filter((o) => o.status === filter)

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex h-10 items-center px-2 text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
              Car<span className="text-primary">Volf</span>
              <span className="ml-1.5 text-[13px] font-normal text-muted-foreground">Garage</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton isActive={active === item.label} tooltip={item.label} onClick={() => setActive(item.label)}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2.5 p-1">
              <Avatar>
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-[13px] leading-4 group-data-[collapsible=icon]:hidden">
                <p className="truncate font-medium">Sufiyan Jin</p>
                <p className="truncate text-muted-foreground">Service advisor</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <InputGroup className="max-w-md min-w-0 flex-1">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search customers, vehicles, orders…" aria-label="Search" />
            </InputGroup>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </Button>
              {/* Narrow screens get a square icon button so the + sits dead centre. */}
              <Button size="icon" className="lg:hidden" aria-label="Create service order">
                <PlusIcon />
              </Button>
              <Button className="hidden lg:inline-flex">
                <PlusIcon data-icon="inline-start" />
                Create service order
              </Button>
            </div>
          </header>

          <main className="flex min-w-0 flex-col gap-5 p-4 md:p-6">
            <PageHeader title={active} description="Pune Main Branch · 20/11/2026" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Today's revenue" value="₹84,250" delta="+12%" trend="up" hint="vs yesterday" icon={IndianRupeeIcon} />
              <MetricCard label="Active service orders" value="27" delta="+3" trend="up" hint="this week" icon={WrenchIcon} />
              <MetricCard label="Pending approvals" value="6" delta="2 overdue" tone="error" icon={ClipboardCheckIcon} />
              <MetricCard label="Low stock items" value="9" delta="Reorder" tone="warning" icon={TriangleAlertIcon} />
            </div>

            <Card className="min-w-0">
              <CardHeader className="flex-wrap">
                <CardTitle>Recent service orders</CardTitle>
                <CardAction>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={filter}
                    onValueChange={(v) => v && setFilter(v as (typeof FILTERS)[number])}
                    aria-label="Filter by status"
                  >
                    {FILTERS.map((f) => (
                      <ToggleGroupItem key={f} value={f}>
                        {f}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <a href={`#${o.id}`} className="font-medium text-primary underline-offset-4 hover:underline">
                            {o.id}
                          </a>
                        </TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{o.vehicle}</span>
                            <PlateNumber size="sm">{o.reg}</PlateNumber>
                          </div>
                        </TableCell>
                        <TableCell>{o.service}</TableCell>
                        <TableCell>
                          <StatusBadge tone={o.tone}>{o.status}</StatusBadge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{inr(o.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
