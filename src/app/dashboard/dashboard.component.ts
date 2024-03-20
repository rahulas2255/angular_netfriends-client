import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { query } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  currentPostId:String = ""
  allUsers:any = []
  query:String = ""
  userId:String = ""
  comment:String = ""
  files: any = []
  postDetails:any = {}
  addpost:boolean = false
  loginUsername:string=""
  allPosts:any = []
  postImage:string = ""

  postAdd(){
    this.addpost = true
  }

  constructor(public api:ApiService,private toaster:ToastrService,private router:Router){}
  

  ngOnInit(): void {
    if(sessionStorage.getItem("existingUser")){
      this.loginUsername = JSON.parse(sessionStorage.getItem("existingUser") || "").name
      this.userId = JSON.parse(sessionStorage.getItem("existingUser") || "")._id
      console.log(this.userId);
      
    }else{
      this.loginUsername = ""
    }
    this.getAllPost()
    this.getAllUsers()
    
    
  }
 
 
 
  getAllPost(){
    this.api.getAllPostAPI().subscribe((res:any)=>{
      
      this.allPosts = res.map((item:any)=>{
        item.postImage = `${this.api.SERVER_URL}/post-image/${item.postImage}`
        item.user.profilePicture = `${this.api.SERVER_URL}/user-image/${item.user.profilePicture}`
        // item.postComment.forEach((data:any)=>{
        //   data.commentUserImage =  `${this.api.SERVER_URL}/user-image/${data.commentUserImage}`
        // })
        return item
      })
      console.log(res);
      console.log(this.allPosts);
      
      
      
    })
  }

  onFileChange(event:any){
    this.files = event.target.files[0];
    this.postDetails.postImage = this.files
    let fr = new FileReader()
    fr.readAsDataURL(this.files)
    fr.onload = (event:any)=>{

      this.postImage = event.target.result
    }

  }

 
  createPost(){
    const formData = new FormData()
    formData.append("postText",this.postDetails.postText)
    formData.append("postImage",this.postDetails.postImage)
    console.log("formdata",formData);
    
    this.api.createPostAPI(formData).subscribe({

      next:(res:any)=>{
        console.log(res);
        this.addpost = false
        this.getAllPost()
        this.postDetails.postText = ""
        this.postImage = ""
        
      },
      error:(res:any)=>{
        console.log(res.error);
        
      }
    })
   
  }
  setPostId(id:any){
   this.currentPostId = id
  }

  commentPost(id:any):any{
    if(!this.comment) return this.toaster.warning('Please type any comment!!!')
    this.api.postCommentAPI(this.comment,this.currentPostId).subscribe({
    next:(res:any)=>{
      console.log(res);
      document.getElementById('closeModal')?.click()
      this.getAllPost()
      this.comment = ""
    },
    error:(res:any)=>{
      console.log(res.error);
      
    }
  })
  }

  likeToggle(id:any){
    this.api.likePostAPI(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.getAllPost()
        
      },
      error:(res:any)=>{
        console.log(res.error);
        
      }
    })
  }
  handleInputChange(event: Event){
    console.log(event.target,this.query);
    this.getAllUsers()
    
  }
  getAllUsers(){
    this.api.getAllUsersAPI(this.query).subscribe({
      next:(res:any)=>{
        console.log("All users",res);
        this.allUsers = res
        
        
      },
      error:(res:any)=>{
        console.log(res.error);
        
      }
    })
  }
  logout(){
    sessionStorage.clear()
    this.router.navigateByUrl('/')
    
  }
}
