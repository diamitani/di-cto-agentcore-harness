# AWS Cloud Development Environment Setup

This guide will transform your Mac into a thin client and move all development to AWS EC2 with S3 storage.

## Architecture

```
Mac (Thin Client)
  ├── Cursor (connects via Remote SSH)
  ├── Claude Code (connects to EC2)
  ├── Terminal (SSH)
  └── Browser (port forwarding)
       ↓
EC2 Ubuntu (Your Development Machine)
  ├── /home/ubuntu/projects (500GB EBS)
  ├── /mnt/projects → s3://patrick-projects
  ├── /mnt/assets → s3://patrick-assets
  ├── Node.js, Docker, Git, etc.
  └── Nightly backups to S3
       ↓
S3 Buckets
  ├── patrick-projects (code backups)
  └── patrick-assets (large files)
       ↓
GitHub
  └── Remote repositories
```

## Benefits

✅ **Unlimited Storage** - 500GB working disk + unlimited S3  
✅ **No Disk Space Issues** - Never run out of space again  
✅ **Work from Anywhere** - SSH from any machine  
✅ **Automatic Backups** - Nightly S3 sync  
✅ **Stop/Start** - Only pay for storage when stopped  
✅ **Snapshots** - Easy rollbacks  
✅ **Scalable** - Upgrade instance size anytime  

## Quick Start

### Option 1: Push Current Changes First (Recommended)

If you want to push your landing page changes to GitHub before migrating:

```bash
chmod +x ~/quick-git-push.sh
~/quick-git-push.sh
```

### Option 2: Full AWS Migration

Follow these steps in order:

#### Step 1: Sync Current Work to S3

```bash
chmod +x ~/sync-to-aws.sh
~/sync-to-aws.sh
```

This uploads your current projects to S3 (including the new landing page).

#### Step 2: Launch EC2 Development Server

```bash
chmod +x ~/setup-aws-dev.sh
~/setup-aws-dev.sh
```

This will:
- Create S3 buckets (patrick-projects, patrick-assets)
- Create SSH key pair
- Launch EC2 instance (t3.xlarge, 500GB)
- Install Node.js, Docker, Git, AWS CLI
- Mount S3 buckets
- Setup automatic backups

Wait time: ~5 minutes

#### Step 3: Connect and Clone

```bash
# Get your instance IP (displayed at end of setup)
ssh -i ~/.ssh/patrick-aws-dev.pem ubuntu@YOUR_EC2_IP

# On EC2:
cd /home/ubuntu/projects

# Download from S3
aws s3 sync s3://patrick-projects/artispreneur-agent/ ./artispreneur-agent/
cd artispreneur-agent

# Or clone fresh from GitHub
git clone https://github.com/diamitani/artispreneur-agent.git
cd artispreneur-agent

# Install dependencies (now you have space!)
npm install

# Push your new landing page changes
git add src/components/marketing/AnimatedHero.tsx
git add src/components/marketing/NewLandingV2.tsx
git add src/app/page.tsx

git commit -m "Replace landing page with animated Agent Landing v2 design

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push
```

#### Step 4: Configure Cursor for Remote SSH

See `setup-cursor-remote.md` for detailed Cursor setup.

Quick version:

1. Add to `~/.ssh/config`:
```
Host devbox
    HostName YOUR_EC2_IP
    User ubuntu
    IdentityFile ~/.ssh/patrick-aws-dev.pem
    ForwardAgent yes
```

2. In Cursor: `Cmd+Shift+P` → "Remote-SSH: Connect to Host" → `devbox`

3. Open `/home/ubuntu/projects/artispreneur-agent`

#### Step 5: Test Your New Landing Page

```bash
# On EC2
npm run dev
```

Open in your Mac browser: http://localhost:3000

## Daily Workflow

### Morning:
```bash
# Start your EC2 instance
aws ec2 start-instances --instance-ids i-xxxxx --region us-east-1

# Connect via SSH or Cursor
ssh devbox
```

### During the Day:
- All work happens on EC2
- Cursor connects remotely
- Git operations on EC2
- Builds run on EC2 (no local disk usage!)

### Evening:
```bash
# Stop instance to save costs
aws ec2 stop-instances --instance-ids i-xxxxx --region us-east-1
```

Stopped instance costs: ~$50/month (storage only)
Running instance costs: ~$120/month (if running 24/7)

**Pro tip:** Stop when not using = ~$70/month total

## Cost Breakdown

| Resource | Cost |
|----------|------|
| EC2 t3.xlarge (stopped) | $0/hour |
| EBS 500GB gp3 | ~$40/month |
| S3 storage (100GB) | ~$2.30/month |
| Data transfer | ~$5/month |
| **Total (stopped)** | **~$47/month** |
| EC2 t3.xlarge (running) | ~$0.1664/hour |
| **Total (24/7)** | **~$167/month** |
| **Total (8hrs/day)** | **~$87/month** |

Compare to:
- Buying new Mac with more storage: $2000+
- External SSD: $200-400 (still limited)
- **AWS: $50-90/month** ✅

## Files Created

- `quick-git-push.sh` - Push current changes to GitHub immediately
- `sync-to-aws.sh` - Upload local projects to S3
- `setup-aws-dev.sh` - Launch and configure EC2 instance
- `setup-cursor-remote.md` - Configure Cursor for remote development
- `AWS-DEV-SETUP-README.md` - This file

## What's Next?

### Immediate (Right Now):

```bash
# Option A: Just push to GitHub
chmod +x ~/quick-git-push.sh
~/quick-git-push.sh

# Option B: Full AWS migration
chmod +x ~/sync-to-aws.sh ~/setup-aws-dev.sh
~/sync-to-aws.sh
~/setup-aws-dev.sh
```

### Soon:

1. Configure Cursor Remote SSH
2. Move all projects to EC2
3. Setup Claude Code on EC2
4. Configure automatic backups
5. Create EBS snapshots
6. (Optional) Setup Elastic IP for consistent IP address

### Later:

1. Add more projects (GencyAI, Revenabled, etc.)
2. Upgrade to t3.2xlarge if needed (8 vCPUs, 32GB RAM)
3. Setup CI/CD pipelines
4. Configure AWS Systems Manager for secure access
5. Add monitoring with CloudWatch

## Troubleshooting

### Can't SSH in?

Check security group allows your IP:
```bash
MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 22 \
  --cidr ${MY_IP}/32
```

### S3 buckets not mounting?

```bash
# On EC2
sudo /home/ubuntu/mount-s3-buckets.sh
```

### Need more storage?

```bash
# Resize EBS volume
aws ec2 modify-volume --volume-id vol-xxxxx --size 1000

# On EC2, grow filesystem
sudo growpart /dev/xvda 1
sudo resize2fs /dev/xvda1
```

### Forgot instance ID?

```bash
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=patrick-devbox" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text
```

## Support

If you run into issues:

1. Check AWS CloudWatch logs
2. SSH into EC2 and check `/var/log/cloud-init-output.log`
3. Verify IAM roles are attached
4. Ensure S3 buckets exist

## Security Notes

🔒 **SSH Key:** Keep `~/.ssh/patrick-aws-dev.pem` secure (chmod 400)  
🔒 **Security Group:** Only allows SSH from your IP  
🔒 **IAM Roles:** EC2 has read/write to S3 buckets only  
🔒 **Backups:** Automatic nightly backups to S3  
🔒 **Snapshots:** Create before major changes  

## Summary

This setup gives you:

1. **Unlimited development space** (no more ENOSPC errors!)
2. **Work from anywhere** (SSH from any machine)
3. **Automatic backups** (never lose work)
4. **Cost effective** (stop when not using)
5. **Professional setup** (same as enterprise engineers)

Your Mac becomes a thin client - just Cursor, Terminal, and Browser.

**Everything else runs in the cloud.** 🚀
