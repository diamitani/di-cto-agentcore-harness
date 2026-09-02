# Diamitani Industries AWS Dev Server

## Your New Cloud Computer

| Property | Value |
|----------|-------|
| **IP Address** | `98.84.53.116` |
| **Instance ID** | `i-0506120528e2d4649` |
| **Type** | t3.large (2 CPU, 8GB RAM) |
| **Disk** | 500GB SSD (gp3) |
| **OS** | Ubuntu 24.04 LTS |
| **Region** | us-east-1 |
| **Monthly Cost** | ~$60-70 (instance) + $40 (storage) = **~$100-110/mo** |

---

## How to Connect

### From Terminal (Mac)
```bash
# Quick connect (I added this alias)
ssh di

# Or full command
ssh -i ~/.ssh/diamitani-aws ubuntu@98.84.53.116
```

### From Cursor/VS Code
1. Install "Remote - SSH" extension (built-in)
2. Press `Cmd+Shift+P` → "Remote-SSH: Connect to Host..."
3. Type `di` or `ubuntu@98.84.53.116`
4. Select Linux when prompted
5. Open folder: `/home/ubuntu/diamitani-industries`

### From Hermes Desktop
```bash
# In Hermes terminal, just run:
ssh di
```

---

## Directory Structure

```
/home/ubuntu/diamitani-industries/
├── .hermes/                    # Hermes Agent config
├── artispreneur/               # rostragent.com
│   ├── business-os/            # Internal tools
│   ├── products/
│   │   ├── epk-builder/        # EPK product
│   │   ├── academy/            # Learning platform
│   │   └── agent/              # Multi-agent runtime
│   └── user-workspaces/        # Per-tenant data
├── creditfixer/
│   ├── business-os/
│   ├── products/dashboard/
│   └── user-workspaces/
├── sixthagent/
│   ├── business-os/
│   ├── products/platform/
│   └── user-workspaces/
├── 48ward/
│   ├── business-os/
│   ├── products/toolkit/
│   └── user-workspaces/
└── knowledge-base/             # RAG DAL shared knowledge
    ├── global/
    ├── artispreneur/
    ├── creditfixer/
    └── sixthagent/
```

---

## Quick Aliases (on the server)

Once connected, these shortcuts work:
```bash
di       # cd to ~/diamitani-industries
art      # cd to artispreneur/
credit   # cd to creditfixer/
sixth    # cd to sixthagent/
ward     # cd to 48ward/
kb       # cd to knowledge-base/
```

---

## Tools Installed

- **Hermes Agent** v0.19.0
- **Node.js** v20.20.2 + npm + pnpm
- **Python** 3.12 + uv (fast package manager)
- **AWS CLI** v2.36.6
- **GitHub CLI** v2.96.0
- **git**, **curl**, **jq**, **htop**, **tmux**, **tree**

---

## Next Steps

### 1. Set up AWS credentials on the server
```bash
ssh di
aws configure
# Enter your access key, secret key, region (us-east-1)
```

### 2. Clone your repos
```bash
ssh di
cd ~/diamitani-industries/artispreneur/products/epk-builder
git clone https://github.com/diamitani/artistsepks.git .
```

### 3. Configure Hermes
```bash
ssh di
hermes config set provider anthropic
hermes config set model claude-sonnet-4
# Or use Bedrock:
hermes config set provider bedrock
```

---

## SSH Key Location (on your Mac)

```
~/.ssh/diamitani-aws       # Private key (keep safe!)
~/.ssh/diamitani-aws.pub   # Public key
```

---

## Cost Breakdown

| Resource | Monthly Cost |
|----------|-------------|
| t3.large instance | ~$60 |
| 500GB gp3 storage | ~$40 |
| Data transfer (est.) | ~$5-10 |
| **Total** | **~$100-110/mo** |

To reduce cost when not using:
```bash
# Stop instance (keeps disk, no compute charge)
aws ec2 stop-instances --instance-ids i-0506120528e2d4649 --region us-east-1

# Start it back up
aws ec2 start-instances --instance-ids i-0506120528e2d4649 --region us-east-1
```

---

## Old Instances (Terminated)

These were deleted (inaccessible + too small):
- i-0e6fe10fc680ea467 (t3.medium, 8GB) ❌
- i-05dc9c09fe056d67a (t3.small, 20GB) ❌
