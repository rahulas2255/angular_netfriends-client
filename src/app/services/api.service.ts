import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  userId:string=""

  SERVER_URL = "https://angular-netfriends-server.onrender.com"

  constructor(private http:HttpClient) {
    
   }


  registerAPI(user:any){
    return this.http.post(`${this.SERVER_URL}/register`,user)
  }
  loginAPI(user:any){
    return this.http.post(`${this.SERVER_URL}/login`,user)
  }

  appendTokenToHeader(){
    const token = sessionStorage.getItem("token")
    let headers = new HttpHeaders()
    if(token){
      headers = headers.append("Authorization",`Bearer ${token}`)
    }
    return {headers}
  }

  createPostAPI(post:any){
    return this.http.post(`${this.SERVER_URL}/post/create`,post,this.appendTokenToHeader())
  }


  getAllPostAPI(){
    return this.http.get(`${this.SERVER_URL}/post/all`,this.appendTokenToHeader())
  }
  postCommentAPI(comment:String,postId:String){
    return this.http.post(`${this.SERVER_URL}/post/comment/${postId}`,{commentText:comment},this.appendTokenToHeader())
  }
  likePostAPI(id:String){
    return this.http.get(`${this.SERVER_URL}/post/like/${id}`,this.appendTokenToHeader())
  }
  getAllUsersAPI(q:String){
    return this.http.get(`${this.SERVER_URL}/users/all?q=${q}`,this.appendTokenToHeader())
  }
  getUserPosts(id:String){
    return this.http.get(`${this.SERVER_URL}/posts/user/${id}`,this.appendTokenToHeader())
  }
  updateProfileAPI(id:String,user:any){
    return this.http.put(`${this.SERVER_URL}/users/profile/update/${id}`,user,this.appendTokenToHeader())
  }
}
